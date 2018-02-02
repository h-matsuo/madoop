#!/usr/bin/env bash

EMSCRIPTEN_IMAGE_NAME="trzeci/emscripten"
EMSCRIPTEN_IMAGE_TAG="sdk-tag-1.37.29-64bit"

SCRIPT_DIR="$(cd $(dirname "${BASH_SOURCE:-$0}"); pwd)"

FLAG_CPP=false
if [[ -z "$1" ]]; then
  exit 1
fi
case "$1" in
  c++) FLAG_CPP=true ;;
  *)   exit 1        ;;
esac

run_emscripten () {
  docker run --rm -t \
    -v "${SCRIPT_DIR}:/src" \
    "${EMSCRIPTEN_IMAGE_NAME}:${EMSCRIPTEN_IMAGE_TAG}" "$@"
}

if $FLAG_CPP; then
  run_emscripten emcc "${2}.cpp" \
    -std=c++11 \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s "EXPORTED_FUNCTIONS=['_${2}']" \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" \
    --js-library lib.js \
    -o "${2}.js"
fi
