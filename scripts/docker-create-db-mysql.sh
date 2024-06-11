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
echo "Creating MySQL DB"
echo "-----------------------------------------------------------"

docker run -d --name project-db-container \
    -e MYSQL_DATABASE=$DATABASE_NAME \
    -e MYSQL_USER=$DATABASE_USER \
    -e MYSQL_PASSWORD=$DATABASE_PASSWORD \
    -e MYSQL_ROOT_PASSWORD=$DATABASE_ROOT_PASSWORD \
    -p $DATABASE_PORT:$DATABASE_PORT \
    -d mysql:latest

echo "-----------------------------------------------------------"
echo "Created DB successfully"
echo "-----------------------------------------------------------"
