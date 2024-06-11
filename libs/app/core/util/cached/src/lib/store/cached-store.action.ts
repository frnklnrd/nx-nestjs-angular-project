/* eslint-disable @typescript-eslint/no-explicit-any */
export class CachedSetKeyDataStoreAction {
  static readonly type = '[CACHED] Set Key Data';

  constructor(public key: string, public data: any) {}
}

export class CachedResetKeyDataStoreAction {
  static readonly type = '[CACHED] Reset Key Data';

  constructor(public key: string) {}
}

export class CachedResetAllStoreAction {
  static readonly type = '[CACHED] Reset All';

  constructor() {
    //
  }
}
