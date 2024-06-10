#!/bin/bash

echo "-----------------------------------------------------------"
echo "Running Create Angular Library"
echo "-----------------------------------------------------------"

# Getting module_name
echo "Enter module_name:"
#stty -echo
read module_name
#stty echo
#module_name="app"

npx nx generate @nx/angular:library \
  --name=app-core-$module_name \
  --directory=libs/app/core/$module_name \
  --importPath=@project/app-core-$module_name \
  --buildable=true \
  --publishable=true \
  --changeDetection=OnPush \
  --prefix=app \
  --projectNameAndRootFormat=as-provided \
  --simpleName=true \
  --standalone=false \
  --style=scss \
  --no-interactive #--dry-run

echo "-----------------------------------------------------------"
echo "Created Angular Library successfully"
echo "-----------------------------------------------------------"
