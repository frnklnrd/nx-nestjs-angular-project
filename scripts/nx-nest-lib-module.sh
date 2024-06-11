#!/bin/bash

echo "-----------------------------------------------------------"
echo "Running Create Nest Library"
echo "-----------------------------------------------------------"

# Getting module_name
echo "Enter module_name:"
#stty -echo
read module_name
#stty echo
#module_name="app"

npx nx generate @nx/nest:library \
	--name=api-module-$module_name-api \
	--directory=libs/api/module/$module_name/api \
	--importPath=@project/api-module-$module_name-api \
	--buildable=true \
	--publishable=true \
	--controller=false \
	--projectNameAndRootFormat=as-provided \
	--service=false \
	--simpleName=true \
	--no-interactive # --dry-run

npx nx generate @nx/nest:library \
	--name=api-module-$module_name-model \
	--directory=libs/api/module/$module_name/model \
	--importPath=@project/api-module-$module_name-model \
	--buildable=true \
	--publishable=true \
	--controller=false \
	--projectNameAndRootFormat=as-provided \
	--service=false \
	--simpleName=true \
	--no-interactive # --dry-run

npx nx generate @nx/nest:library \
	--name=api-module-$module_name-service \
	--directory=libs/api/module/$module_name/service \
	--importPath=@project/api-module-$module_name-service \
	--buildable=true \
	--publishable=true \
	--controller=false \
	--projectNameAndRootFormat=as-provided \
	--service=false \
	--simpleName=true \
	--no-interactive # --dry-run

npx nx generate @nx/nest:library \
	--name=api-module-$module_name-resource \
	--directory=libs/api/module/$module_name/resource \
	--importPath=@project/api-module-$module_name-resource \
	--buildable=true \
	--publishable=true \
	--controller=false \
	--projectNameAndRootFormat=as-provided \
	--service=false \
	--simpleName=true \
	--no-interactive # --dry-run

echo "-----------------------------------------------------------"
echo "Created Nest Library successfully"
echo "-----------------------------------------------------------"
