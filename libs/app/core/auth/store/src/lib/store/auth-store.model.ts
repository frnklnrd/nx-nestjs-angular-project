/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthStoreModel {
  logged: boolean;
  loggedAt: string | number | Date | null;
  loadedFromStore: boolean;
  accessToken: any;
  refreshToken: any;
  userData: any;
  userPermissions: any;
  checkingAuthTokenValid: boolean;
}
