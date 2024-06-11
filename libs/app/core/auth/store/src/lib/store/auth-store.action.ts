/* eslint-disable @typescript-eslint/no-explicit-any */

export class AuthUpdateLoginDataAction {
  static readonly type = '[AUTH] Update Login Data';

  constructor(
    public loginData: {
      logged: boolean;
      accessToken: any;
      refreshToken: any;
      userData: any;
      userPermissions: any;
    }
  ) {}
}

export class AuthRefreshTokensDataAction {
  static readonly type = '[AUTH] Refresh Tokens Data';

  constructor(
    public tokensData: {
      accessToken: any;
      refreshToken: any;
    }
  ) {}
}

export class AuthLoginInitStoreAction {
  static readonly type = '[AUTH] Login Init';

  constructor(public loggedIn: boolean) {}
}

export class AuthLoginOkStoreAction {
  static readonly type = '[AUTH] Login Ok';

  constructor(public loggedIn: boolean) {}
}

export class AuthRefreshTokenInitStoreAction {
  static readonly type = '[AUTH] Refresh Token Init';

  constructor(public refreshTkn: boolean) {}
}

export class AuthRefreshTokenOkStoreAction {
  static readonly type = '[AUTH] Refresh Token Ok';

  constructor(public refreshTkn: boolean) {}
}

export class AuthLogoutInitStoreAction {
  static readonly type = '[AUTH] Logout Init';

  constructor(public loggedOut: boolean) {}
}

export class AuthLogoutOkStoreAction {
  static readonly type = '[AUTH] Logout Ok';

  constructor(public loggedOut: boolean) {}
}

export class NotifyCheckingAuthTokenValidStoreAction {
  static readonly type = '[AUTH] Notify Checking Auth Token Valid';

  constructor(public checking: boolean) {}
}
