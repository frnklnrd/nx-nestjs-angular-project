/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { StorageEngine } from '@ngxs/storage-plugin';
import { CryptoUtilService } from '@project/app-core-util-crypto';

import {
  UTIL_STORE_STORAGE_PREFIX_KEY_TOKEN,
  UTIL_STORE_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN,
  UTIL_STORE_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN
} from '../variable/variables';

@Injectable()
export class StorageUtilService implements StorageEngine {
  protected readonly crypto: CryptoUtilService =
    inject<CryptoUtilService>(CryptoUtilService);

  // --------------------------------------------------------------

  private prefixKey: string = inject<string>(
    UTIL_STORE_STORAGE_PREFIX_KEY_TOKEN
  );

  private useCryptoForKeys: boolean = inject<boolean>(
    UTIL_STORE_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN
  );

  private useCryptoForValues: boolean = inject<boolean>(
    UTIL_STORE_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN
  );

  // --------------------------------------------------------------

  private getPrefixKey(): string {
    return this.prefixKey ? this.prefixKey.toUpperCase() : 'APP';
  }

  private getUseCryptoForKeys(): boolean {
    return !!this.useCryptoForKeys;
  }

  private getUseCryptoForValues(): boolean {
    return !!this.useCryptoForValues;
  }

  // --------------------------------------------------------------

  protected getStorage(session = false): Storage {
    return session ? sessionStorage : localStorage;
  }

  protected getFullKey(key: string): string {
    const fullKey =
      this.getPrefixKey() +
      ':[' +
      (this.getUseCryptoForKeys() ? this.crypto.md5(key) : key) +
      ']';
    return fullKey;
  }

  protected getEncryptedData(str: string): any {
    if (!this.getUseCryptoForValues()) {
      return str;
    }
    const stringifiedData = JSON.stringify({ val: str });
    return this.crypto.encrypt(stringifiedData);
  }

  protected getDecryptedData(str: string): string {
    if (!this.getUseCryptoForValues()) {
      return str;
    }
    const decodedData = this.crypto.decrypt(str);
    const parsedData = JSON.parse(decodedData);
    return parsedData?.val !== undefined ? parsedData.val : null;
  }

  // ----------------------------------

  get length(): number {
    return this.getStorage(false).length + this.getStorage(true).length;
  }

  setItem(key: string, val: any): void {
    const fullKey = this.getFullKey(key);
    const encoded = this.getEncryptedData(val);
    // TODO local or session?
    this.getStorage().setItem(fullKey, encoded);
  }

  getItem(key: string): any {
    const fullKey = this.getFullKey(key);
    // TODO local or session?
    const encoded = this.getStorage().getItem(fullKey);
    if (encoded) {
      try {
        const decodedData = this.getDecryptedData(encoded);
        return decodedData;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    // TODO local or session?
    this.getStorage().removeItem(fullKey);
  }

  clear(): void {
    this.getStorage(false).clear();
    this.getStorage(true).clear();
  }

  key(val: number): string | null {
    // TODO local or session?
    return this.getStorage().key(val);
  }
}
