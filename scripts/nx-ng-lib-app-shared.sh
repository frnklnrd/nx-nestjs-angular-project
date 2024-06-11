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
  --name=app-shared-$module_name-feature \
  --directory=libs/app/shared/$module_name/feature \
  --importPath=@project/app-shared-$module_name-feature \
  --buildable=true \
  --publishable=true \
  --changeDetection=OnPush \
  --prefix=app \
  --projectNameAndRootFormat=as-provided \
  --simpleName=true \
  --standalone=false \
  --style=scss \
  --no-interactive #--dry-run

npx nx generate @nx/angular:library \
  --name=app-shared-$module_name-service \
  --directory=libs/app/shared/$module_name/service \
  --importPath=@project/app-shared-$module_name-service \
  --buildable=true \
  --publishable=true \
  --changeDetection=OnPush \
  --prefix=app \
  --projectNameAndRootFormat=as-provided \
  --simpleName=true \
  --standalone=false \
  --style=scss \
  --no-interactive #--dry-run

npx nx generate @nx/angular:library \
  --name=app-shared-$module_name-ui \
  --directory=libs/app/shared/$module_name/ui \
  --importPath=@project/app-shared-$module_name-ui \
  --buildable=true \
  --publishable=true \
  --changeDetection=OnPush \
  --prefix=app \
  --projectNameAndRootFormat=as-provided \
  --simpleName=true \
  --standalone=false \
  --style=scss \
  --no-interactive #--dry-run


npx nx generate @nx/angular:library \
  --name=app-shared-$module_name-store \
  --directory=libs/app/shared/$module_name/store \
  --importPath=@project/app-shared-$module_name-store \
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
