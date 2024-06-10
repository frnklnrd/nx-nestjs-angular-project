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
echo "Creating POSTGRES DB"
echo "-----------------------------------------------------------"

docker run -d --name project-db-container \
    -e POSTGRES_DB=$DATABASE_NAME \
    -e POSTGRES_USER=$DATABASE_USER \
    -e POSTGRES_PASSWORD=$DATABASE_PASSWORD \
    -p $DATABASE_PORT:$DATABASE_PORT \
    -d postgres:latest

echo "-----------------------------------------------------------"
echo "Created DB successfully"
echo "-----------------------------------------------------------"
