#!/bin/bash

# load .env vars

if [ -f .env ]; then
    set -a
    [ -f .env ] && . .env
    set +a
else
    echo "File .env not exists."
    exit 1
fi

echo "-----------------------------------------------------------"
echo "Running Prettier in repo code"
echo "-----------------------------------------------------------"

npx nx run-many -t lint --fix --skip-nx-cache

npx prettier --write .

echo "-----------------------------------------------------------"
echo "Prettier in repo code successfully"
echo "-----------------------------------------------------------"
