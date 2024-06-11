/* eslint-disable @typescript-eslint/no-explicit-any */
export class ConfigSetKeyValueStoreAction {
  static readonly type = '[CONFIG] Set Key Value';

  constructor(public key: string, public value: any) {}
}
