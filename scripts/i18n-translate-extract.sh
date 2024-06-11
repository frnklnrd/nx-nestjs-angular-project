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
echo "Extracting I18n Data"
echo "-----------------------------------------------------------"

npx ngx-translate-extract \
--input ./apps/app/src/app  \
--input ./libs/app  \
--output ./apps/app/src/assets/i18n/en.json \
--output ./apps/app/src/assets/i18n/es.json \
--output ./apps/app/src/assets/i18n/ca.json \
--output ./apps/app/src/assets/i18n/sa.json \
--format namespaced-json \
--format-indentation "  "  \
--marker _i18n \
--sort

echo "-----------------------------------------------------------"
echo "I18n Data extracted successfully"
echo "-----------------------------------------------------------"

# ---------------------------------------------------------------

# in .html files:

# {{ 'label.key.id' | translate }}

# in .ts files:

# import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
#
# ...
#
# let label_id = _i18n('label.key.id');
# let label_text = this.translate.instant(_i18n('label.key.id'));

# ---------------------------------------------------------------
