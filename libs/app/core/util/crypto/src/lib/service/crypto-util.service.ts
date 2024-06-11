/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { UTIL_CRYPTO_SECRET_KEY_TOKEN } from '../variable/variables';

@Injectable()
export class CryptoUtilService {
  private secret: string = inject<string>(UTIL_CRYPTO_SECRET_KEY_TOKEN);

  constructor() {
    //
  }

  public md5(str: string): string {
    return CryptoJS.MD5(str ? str : '').toString();
  }

  public encrypt(str: string): string {
    const _key = CryptoJS.enc.Utf8.parse(this.secret);
    const _iv = CryptoJS.enc.Utf8.parse(this.secret);
    const encrypted = CryptoJS.AES.encrypt(str ? str : '', _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  public decrypt(str: string): string {
    const _key = CryptoJS.enc.Utf8.parse(this.secret);
    const _iv = CryptoJS.enc.Utf8.parse(this.secret);
    const decrypted = CryptoJS.AES.decrypt(str, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
