export class I18nChangeDefaultLangStoreAction {
  static readonly type = '[I18N] Change Default Lang';

  constructor(public lang: string) {}
}

export class I18nChangeCurrentLangStoreAction {
  static readonly type = '[I18N] Change Current Lang';

  constructor(public lang: string) {}
}

/*
export class I18nChangeDateFormatStoreAction {
  static readonly type = '[I18N] Change Date Format';

  constructor(public dateFormat: string) {}
}

export class I18nChangeTextDirectionInvertedStoreAction {
  static readonly type = '[I18N] Change Text Direction Inverted';

  constructor(public textDirectionInverted: boolean) {}
}

export class I18nChangeTextDirectionStoreAction {
  static readonly type = '[I18N] Change Text Direction';

  constructor(public textDirection: string) {}
}
*/
