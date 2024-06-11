/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AUTH_STATE_TOKEN } from '../variable/variables';

import {
  AuthLoginOkStoreAction,
  AuthLogoutOkStoreAction,
  AuthRefreshTokenOkStoreAction,
  AuthRefreshTokensDataAction,
  AuthUpdateLoginDataAction,
  NotifyCheckingAuthTokenValidStoreAction
} from './auth-store.action';
import { AuthStoreModel } from './auth-store.model';

@State<AuthStoreModel>({
  name: AUTH_STATE_TOKEN,
  defaults: {
    logged: false,
    loggedAt: null,
    loadedFromStore: true,
    accessToken: null,
    refreshToken: null,
    userData: null,
    userPermissions: null,
    checkingAuthTokenValid: false
  }
})
@Injectable()
export class AuthStoreState {
  //-------------------------------------------------------------------------------------

  @Selector()
  static getIsLogged(state: AuthStoreModel): boolean | null {
    return state.logged;
  }

  @Selector()
  static getLoggedAt(state: AuthStoreModel): string | number | Date | null {
    return state.loggedAt;
  }

  @Selector()
  static getIsLoadedFromStore(state: AuthStoreModel): boolean | null {
    return state.loadedFromStore;
  }

  @Selector()
  static getIsDataLoadedFromStorage(state: AuthStoreModel): boolean | null {
    return state.loadedFromStore;
  }

  @Selector()
  static getAccessToken(state: AuthStoreModel): string | null {
    return state?.accessToken ? state.accessToken : null;
  }

  @Selector()
  static getAccessTokenValue(state: AuthStoreModel): string | null {
    return state?.accessToken?.tokenValue
      ? state.accessToken?.tokenValue
      : null;
  }

  @Selector()
  static getAccessTokenExpiresAt(state: AuthStoreModel): Date | null {
    return state?.loggedAt &&
      state?.accessToken?.expiresIn &&
      !Number.isNaN(state?.accessToken?.expiresIn)
      ? new Date(
          new Date(state?.loggedAt).getTime() +
            Number.parseInt(state?.accessToken?.expiresIn)
        )
      : null;
  }

  @Selector()
  static getRefreshToken(state: AuthStoreModel): string | null {
    return state?.refreshToken ? state.refreshToken : null;
  }

  @Selector()
  static getRefreshTokenValue(state: AuthStoreModel): string | null {
    return state?.refreshToken?.tokenValue
      ? state.refreshToken?.tokenValue
      : null;
  }

  @Selector()
  static getRefreshTokenExpiresAt(state: AuthStoreModel): Date | null {
    return state?.loggedAt &&
      state?.refreshToken?.expiresIn &&
      !Number.isNaN(state?.refreshToken?.expiresIn)
      ? new Date(
          new Date(state?.loggedAt).getTime() +
            Number.parseInt(state?.refreshToken?.expiresIn)
        )
      : null;
  }

  @Selector()
  static getUserData(state: AuthStoreModel): any {
    return state.userData;
  }

  @Selector()
  static getUserName(state: AuthStoreModel): string | null {
    return state.userData?.userName ? state.userData?.userName : null;
  }

  @Selector()
  static getUserPermissions(state: AuthStoreModel): string[] | null {
    return state.userPermissions;
  }

  //-------------------------------------------------------------------------------------

  @Action(AuthUpdateLoginDataAction)
  updateLoginDataAction(
    ctx: StateContext<AuthStoreModel>,
    action: AuthUpdateLoginDataAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: action.loginData.logged,
      loggedAt: action.loginData.logged ? new Date().toISOString() : null,
      loadedFromStore: false,
      accessToken: action.loginData.accessToken,
      refreshToken: action.loginData.refreshToken,
      userData: action.loginData.userData,
      userPermissions: action.loginData.userPermissions
        ? action.loginData.userPermissions
        : []
    });
  }

  @Action(AuthRefreshTokensDataAction)
  refreshTokensData(
    ctx: StateContext<AuthStoreModel>,
    action: AuthRefreshTokensDataAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      loggedAt: new Date().toISOString(),
      accessToken: action.tokensData.accessToken,
      refreshToken: action.tokensData.refreshToken
    });
  }

  @Action(AuthLoginOkStoreAction)
  loginOk(
    ctx: StateContext<AuthStoreModel>,
    action: AuthLoginOkStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: action.loggedIn,
      loggedAt: action.loggedIn ? new Date().toISOString() : null,
      loadedFromStore: false
    });
  }

  @Action(AuthRefreshTokenOkStoreAction)
  refreshTokenOk(
    ctx: StateContext<AuthStoreModel>,
    action: AuthRefreshTokenOkStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: action.refreshTkn,
      loggedAt: action.refreshTkn ? new Date().toISOString() : null,
      loadedFromStore: false
    });
  }

  @Action(AuthLogoutOkStoreAction)
  logoutOk(
    ctx: StateContext<AuthStoreModel>,
    action: AuthLogoutOkStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: !action.loggedOut,
      loggedAt: null,
      loadedFromStore: false,
      accessToken: null,
      refreshToken: null,
      userData: null,
      userPermissions: null
    });
  }

  @Action(NotifyCheckingAuthTokenValidStoreAction)
  notifyCheckingAuthTokenValid(
    ctx: StateContext<AuthStoreModel>,
    action: NotifyCheckingAuthTokenValidStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      checkingAuthTokenValid: action.checking
    });
  }

  //-------------------------------------------------------------------------------------
}
