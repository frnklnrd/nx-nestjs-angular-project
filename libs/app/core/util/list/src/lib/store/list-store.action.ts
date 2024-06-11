/* eslint-disable @typescript-eslint/no-explicit-any */
export class ListSetKeyDataStoreAction {
  static readonly type = '[LIST] Set Key Data';

  constructor(public key: string, public data: any) {}
}

export class ListResetKeyDataStoreAction {
  static readonly type = '[LIST] Reset Key Data';

  constructor(public key: string, public allLang = false) {}
}

export class ListResetAllStoreAction {
  static readonly type = '[LIST] Reset All';

  constructor(public allLang = false) {}
}
