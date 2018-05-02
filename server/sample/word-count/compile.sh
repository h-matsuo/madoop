#!/usr/bin/env bash

EMSCRIPTEN_IMAGE_NAME="trzeci/emscripten-slim"
EMSCRIPTEN_IMAGE_TAG="sdk-tag-1.37.38-64bit"

SCRIPT_DIR="$(cd $(dirname "${BASH_SOURCE:-$0}"); pwd)"

run_emscripten () {
  docker run --rm -t \
    -v "${SCRIPT_DIR}:/src" \
    "${EMSCRIPTEN_IMAGE_NAME}:${EMSCRIPTEN_IMAGE_TAG}" "$@"
}

compile() {
  run_emscripten emcc "${1}.cpp" \
    -std=c++11 \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s "EXPORTED_FUNCTIONS=['_${1}']" \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" \
    --js-library lib_emit_func.js \
    -o "${1}.js"
}

compile map
compile reduce
