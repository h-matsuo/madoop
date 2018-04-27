#!/usr/bin/env bash

set -eu

npx gulp build
npx gulp minify
