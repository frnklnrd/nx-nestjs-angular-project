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
echo "Running API application with DEV environment"
echo "-----------------------------------------------------------"

npx nx run api:serve:development
