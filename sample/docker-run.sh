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

# Compile C to wasm
docker run --rm -t \
  -v "${SCRIPT_DIR}:/src" \
  "${EMSCRIPTEN_IMAGE_NAME}:${EMSCRIPTEN_IMAGE_TAG}" \
  emcc sample.c \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s "EXPORTED_FUNCTIONS=['_sample']" \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" \
    -o sample.js

# Preview
echo "Start web server at localhost:${PREVIEW_PORT}..."
docker run -it --rm \
  -p ${PREVIEW_PORT}:80 \
  -v "${SCRIPT_DIR}:/usr/share/nginx/html:ro" \
  "${NGINX_IMAGE_NAME}:${NGINX_IMAGE_TAG}"
