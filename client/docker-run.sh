#!/usr/bin/env bash

SETTINGS=".env"

NGINX_IMAGE_NAME="nginx"
NGINX_IMAGE_TAG="1.13.8-alpine"

PREVIEW_PORT=8000

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
FLAG_PREVIEW=false
if [[ -z "$1" ]]; then
  echo "ERROR: Specify a command to be executed." >&2
  echo "See '$0 --help'." >&2
  exit 1
fi
case "$1" in
  -h)      FLAG_HELP=true    ;;
  --help)  FLAG_HELP=true    ;;
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
  preview           Serve files via localhost:${PREVIEW_PORT}
"
  exit
fi

# Serve files via localhost
if $FLAG_PREVIEW; then
  echo "Start web server at localhost:${PREVIEW_PORT}..."
  docker run -it --rm \
    -p ${PREVIEW_PORT}:80 \
    -v "${SCRIPT_DIR}:/usr/share/nginx/html:ro" \
    "${NGINX_IMAGE_NAME}:${NGINX_IMAGE_TAG}"
fi
