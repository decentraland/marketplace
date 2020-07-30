#! /bin/bash

set -e

source dcl-env
cp .ci/.env.${ENVIRONMENT} .env
