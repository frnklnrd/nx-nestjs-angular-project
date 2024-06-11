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
echo "Generating Api Client"
echo "-----------------------------------------------------------"

mkdir -p ./libs/api-client/ng-api-connector/src/lib/generated/

rm -R ./libs/api-client/ng-api-connector/src/lib/generated/

sed -i 's/localhost/127.0.0.1/g' ./libs/api-client/ng-api-connector/src/lib/resources/swagger.json

for ((i=100; i>=0; i--)); do
    sed -i "s/_$i//g" ./libs/api-client/ng-api-connector/src/lib/resources/swagger.json
done

java -jar ./node_modules/swagger-nodegen-cli/bin/swagger-codegen-cli-3.0.34.jar generate \
     -i ./libs/api-client/ng-api-connector/src/lib/resources/swagger.json \
     -l typescript-angular \
     -o ./libs/api-client/ng-api-connector/src/lib/generated/ \
     --additional-properties npmName=@project/api-client-ng-api-connector,snapshot=true,ngVersion=17.3.0,serviceNamePrefix=api

echo "-----------------------------------------------------------"
echo "Replacing generated names *Service by *ApiService"
echo "-----------------------------------------------------------"

sed -i 's/encodeKey(k: string)/override encodeKey(k: string)/g' ./libs/api-client/ng-api-connector/src/lib/generated/encoder.ts
sed -i 's/encodeValue(v: string)/override encodeValue(v: string)/g' ./libs/api-client/ng-api-connector/src/lib/generated/encoder.ts

#sed -i 's/@Injectable()/import { Link } from \x27..\/model\/link\x27;\n\n\n@Injectable()/' ./libs/api-client/ng-api-connector/src/lib/generated/api/actuator.service.ts \

#find ./libs/api-client/ng-api-connector/src/lib/generated -type f -name '*.ts' -exec grep -q "Service" {} \; \
#-exec sed -i "s/Service/ApiService/g" {} \;

find ./libs/api-client/ng-api-connector/src/lib/generated -type f -name '*.ts' | while read -r file; do
    sed -i "s/Service/ApiService/g" "$file"
    sed -i '1i /* eslint-disable @typescript-eslint/no-empty-interface */' "$file"
    sed -i '1i /* eslint-disable @typescript-eslint/no-explicit-any */' "$file"
    sed -i '1i /* eslint-disable @typescript-eslint/no-unused-vars */' "$file"
    sed -i '1i /* eslint-disable @typescript-eslint/no-namespace */' "$file"
    sed -i '1i /* eslint-disable no-control-regex */' "$file"
done

echo "-----------------------------------------------------------"
echo "Linting & Prettify Api Client library"
echo "-----------------------------------------------------------"

npx prettier --write ./libs/api-client/ng-api-connector

npx nx lint api-client-ng-api-connector --fix --skip-nx-cache

npx prettier --write ./libs/api-client/ng-api-connector

# npx nx build api-client-ng-api-connector

echo "-----------------------------------------------------------"
echo "Api Client generated successfully"
echo "-----------------------------------------------------------"
