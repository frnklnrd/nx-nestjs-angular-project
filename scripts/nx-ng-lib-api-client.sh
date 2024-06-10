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
  --name=api-client-$module_name \
  --directory=libs/api-client/$module_name \
  --importPath=@project/api-client-$module_name \
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
