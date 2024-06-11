import { InjectionToken } from '@angular/core';

export const UTIL_STORE_STORAGE_PREFIX_KEY_TOKEN = new InjectionToken<string>(
  'UTIL_STORE_STORAGE_PREFIX_KEY_TOKEN'
);

export const UTIL_STORE_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN =
  new InjectionToken<boolean>('UTIL_STORE_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN');

export const UTIL_STORE_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN =
  new InjectionToken<boolean>('UTIL_STORE_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN');
