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
	--name=api-core-$module_name \
	--directory=libs/api/core/$module_name \
	--importPath=@project/api-core-$module_name \
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
