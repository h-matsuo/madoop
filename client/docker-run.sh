#!/usr/bin/env bash

SETTINGS=".env"

NGINX_IMAGE_NAME="nginx"
NGINX_IMAGE_TAG="1.15.1-alpine"

PAGE_DIST_PORT=8000
LIB_DIST_PORT=5000

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
FLAG_UP=false
FLAG_DOWN=false
if [[ -z "$1" ]]; then
  echo "ERROR: Specify a command to be executed." >&2
  echo "See '$0 --help'." >&2
  exit 1
fi
case "$1" in
  -h)     FLAG_HELP=true  ;;
  --help) FLAG_HELP=true  ;;
  up)     FLAG_UP=true    ;;
  down)   FLAG_DOWN=true  ;;
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
  up                Start web server and serve index.html and madoop.js.
                    You can access via localhost:${PAGE_DIST_PORT}/index.html
  down              Stop web server.
"
  exit
fi

PAGE_DIST_CONTAINER_NAME="madoop-page-dist"
LIB_DIST_CONTAINER_NAME="madoop-lib-dist"

if $FLAG_UP; then
  docker run -it --rm \
    --name ${PAGE_DIST_CONTAINER_NAME} \
    -p ${PAGE_DIST_PORT}:80 \
    -v "${SCRIPT_DIR}/:/usr/share/nginx/html/:ro" \
    -d \
    "${NGINX_IMAGE_NAME}:${NGINX_IMAGE_TAG}"
  docker run -it --rm \
    --name ${LIB_DIST_CONTAINER_NAME} \
    -p ${LIB_DIST_PORT}:80 \
    -v "${SCRIPT_DIR}/dist:/usr/share/nginx/html:ro" \
    -d \
    "${NGINX_IMAGE_NAME}:${NGINX_IMAGE_TAG}"
  echo "Start web server at localhost:${PAGE_DIST_PORT} and localhost:${LIB_DIST_PORT}..."
fi

if $FLAG_DOWN; then
  docker kill ${PAGE_DIST_CONTAINER_NAME} ${LIB_DIST_CONTAINER_NAME}
fi
