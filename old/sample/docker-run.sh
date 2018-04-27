#!/usr/bin/env bash

SETTINGS=".env"

EMSCRIPTEN_IMAGE_NAME="trzeci/emscripten"
EMSCRIPTEN_IMAGE_TAG="sdk-tag-1.37.29-64bit"

NGINX_IMAGE_NAME="nginx"
NGINX_IMAGE_TAG="1.13.8-alpine"

PREVIEW_PORT=8080

SCRIPT_DIR="$(cd $(dirname "${BASH_SOURCE:-$0}"); pwd)"

# Check whether docker command exists
if ! type docker >/dev/null 2>&1; then
  echo "ERROR: Please install docker at first, and then re-run this script." >&2
  exit 1
fi

# Apply local settings
if [[ -e "$SETTINGS" ]]; then
  source "$SETTINGS"
fi

# Parse options
FLAG_HELP=false
FLAG_C=false
FLAG_CPP=false
FLAG_PREVIEW=false
if [[ -z "$1" ]]; then
  echo "ERROR: Specify a command to be executed." >&2
  echo "See '$0 --help'." >&2
  exit 1
fi
case "$1" in
  -h)      FLAG_HELP=true    ;;
  --help)  FLAG_HELP=true    ;;
  c)       FLAG_C=true       ;;
  cpp)     FLAG_CPP=true     ;;
  preview) FLAG_PREVIEW=true ;;
  *)
    echo "ERROR: "$1": Unknown option." >&2
    echo "See '$0 --help'." >&2
    exit 1
    ;;
esac

# Print usage
if $FLAG_HELP; then
  echo "
Usage: $0 <COMMAND>

A helper tool to run docker commands

Options:
  -h, --help        Print usage

Commands:
  c                 Compile C source file (sample.c)
  cpp               Compile C++ source file (sample.cpp)
  preview           Serve files via localhost:${PREVIEW_PORT}
"
  exit
fi

function run_emscripten () {
  docker run --rm -t \
    -v "${SCRIPT_DIR}:/src" \
    "${EMSCRIPTEN_IMAGE_NAME}:${EMSCRIPTEN_IMAGE_TAG}" "$@"
}

# Compile C source file
if $FLAG_C; then
  run_emscripten emcc sample.c \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s "EXPORTED_FUNCTIONS=['_sample']" \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" \
    -o sample.js
fi

# Compile C++ source file
if $FLAG_CPP; then
  run_emscripten emcc sample.cpp \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s "EXPORTED_FUNCTIONS=['_sample']" \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" \
    -o sample.js
fi

# Serve files via localhost
if $FLAG_PREVIEW; then
  echo "Start web server at localhost:${PREVIEW_PORT}..."
  docker run -it --rm \
    -p ${PREVIEW_PORT}:80 \
    -v "${SCRIPT_DIR}:/usr/share/nginx/html:ro" \
    "${NGINX_IMAGE_NAME}:${NGINX_IMAGE_TAG}"
fi
