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
echo "Themes update assets"
echo "-----------------------------------------------------------"

mkdir -p ./apps/app/src/assets/layout/styles/theme

# mv ./apps/app/src/assets/layout/styles/theme ./apps/app/src/assets/layout/styles/theme.bkp-$(date +%s)
rm -r ./apps/app/src/assets/layout/styles/theme

mkdir -p ./apps/app/src/assets/layout/styles/theme

cp -R ./node_modules/primeng/resources/themes/* ./apps/app/src/assets/layout/styles/theme/

THEMES_FOLDER_DIR="./apps/app/src/assets/layout/styles/theme/"

OUTPUT_FILE_DIR="./apps/app/src/app/theme/theme.names.enum.ts"

touch "$OUTPUT_FILE_DIR"

# mv "$OUTPUT_FILE_DIR" "$OUTPUT_FILE_DIR.bkp-$(date +%s)"
rm "$OUTPUT_FILE_DIR"

touch "$OUTPUT_FILE_DIR"

echo "export enum ThemeNamesEnum {" > $OUTPUT_FILE_DIR

PREFIX_LAST=""

for THEME_SUB_FOLDER in "$THEMES_FOLDER_DIR"/*; do
  if [ -d "$THEME_SUB_FOLDER" ]; then


    THEME_NAME=$(basename "$THEME_SUB_FOLDER")
    THEME_NAME_ENUM_KEY=$(echo "$THEME_NAME" | tr '[:lower:]' '[:upper:]' | tr '-' '_')

    PREFIX_CURRENT=$(echo "$THEME_NAME_ENUM_KEY" | cut -d '_' -f 1)

    if [ "$PREFIX_LAST" != "$PREFIX_CURRENT" ]; then
      echo "  // ------------------------------------------------" >> $OUTPUT_FILE_DIR
    fi

    PREFIX_LAST="$PREFIX_CURRENT"

    echo "  $THEME_NAME_ENUM_KEY = '$THEME_NAME'," >> $OUTPUT_FILE_DIR
  fi
done

echo "  // ------------------------------------------------" >> $OUTPUT_FILE_DIR
echo "}" >> $OUTPUT_FILE_DIR


echo "-----------------------------------------------------------"
echo "Themes assets updated successfully"
echo "-----------------------------------------------------------"
