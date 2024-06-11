/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import {
  AuthApiService,
  AuthTokensResultDto,
  SignInDto
} from '@project/api-client-ng-api-connector';
import { AbstractService } from '@project/app-core-api';
import {
  AuthLoginOkStoreAction,
  AuthLogoutOkStoreAction,
  AuthRefreshTokenOkStoreAction,
  AuthRefreshTokensDataAction,
  AuthStoreState,
  AuthUpdateLoginDataAction
} from '@project/app-core-auth-store';
import { Buffer } from 'buffer';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthCoreService extends AbstractService {
  // -------------------------------------------------------

  protected readonly authApiService: AuthApiService =
    inject<AuthApiService>(AuthApiService);

  // -------------------------------------------------------

  constructor() {
    super();
  }

  // -------------------------------------------------------

  public login(body: SignInDto): Observable<boolean> {
    this.authApiService.configuration.accessToken = null as any;
    return this.authApiService.signIn(body).pipe(
      map((response: any) => response.data as AuthTokensResultDto),
      map((data: AuthTokensResultDto) => {
        this.logger.console.debug('login OK', data);

        const isLogged = !!data?.accessToken?.tokenValue;

        if (isLogged) {
          // create bearer token

          const authorization = data?.accessToken?.tokenValue;

          // update configuration in apis services

          this.authApiService.configuration.accessToken = authorization;

          const payload = JSON.parse(
            Buffer.from(
              data?.accessToken?.tokenValue.split('.')[1],
              'base64'
            ).toString()
          );

          // save data to store

          this.store.dispatch(
            new AuthUpdateLoginDataAction({
              logged: isLogged,
              accessToken: {
                tokenValue: data?.accessToken?.tokenValue,
                expiresIn: data?.accessToken?.expiresIn
              },
              refreshToken: {
                tokenValue: data?.refreshToken?.tokenValue,
                expiresIn: data?.refreshToken?.expiresIn
              },
              userData: payload,
              userPermissions: payload?.permissions
            })
          );
        } else {
          this.store.dispatch(
            new AuthUpdateLoginDataAction({
              logged: isLogged,
              accessToken: null,
              refreshToken: null,
              userData: null,
              userPermissions: null
            })
          );
        }
        return isLogged;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  public dispatchLoginOk(): void {
    this.store.dispatch(new AuthLoginOkStoreAction(true));
  }

  // -------------------------------------------------------

  public refreshToken(): Observable<boolean> {
    const refreshToken: string = this.store.selectSnapshot(
      AuthStoreState.getRefreshTokenValue
    ) as string;

    this.authApiService.configuration.accessToken = refreshToken;

    return this.authApiService
      .refreshToken({
        refreshToken: refreshToken
      })
      .pipe(
        map((response: any) => response.data as AuthTokensResultDto),
        map((data: AuthTokensResultDto) => {
          this.logger.console.log('refresh token OK', data);

          const isLogged: boolean = !!data?.accessToken?.tokenValue as boolean;

          if (isLogged) {
            const authorization = data?.accessToken?.tokenValue;

            this.authApiService.configuration.accessToken = authorization;

            this.store.dispatch(
              new AuthRefreshTokensDataAction({
                accessToken: {
                  tokenValue: data?.accessToken?.tokenValue,
                  expiresIn: data?.accessToken?.expiresIn
                },
                refreshToken: {
                  tokenValue: data?.refreshToken?.tokenValue,
                  expiresIn: data?.refreshToken?.expiresIn
                }
              })
            );
          } else {
            this.store.dispatch(
              new AuthRefreshTokensDataAction({
                accessToken: null,
                refreshToken: null
              })
            );
          }
          return isLogged;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  public dispatchRefreshTokenOk(): void {
    this.store.dispatch(new AuthRefreshTokenOkStoreAction(true));
  }

  // -------------------------------------------------------

  public logout(): Observable<boolean> {
    /*
    const accessToken: string = this.store.selectSnapshot(
      AuthStoreState.getAccessTokenValue
    ) as string;
    const authorizationWithBearer = `Bearer ${accessToken}`;
    */

    return this.authApiService.logout().pipe(
      map((response: any) => {
        return !!response || true;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  public dispatchLogoutOk(): void {
    this.store.dispatch(new AuthLogoutOkStoreAction(true));
  }

  // -------------------------------------------------------

  public check(data?: any): Observable<boolean> {
    this.logger.console.debug('check', data);
    return of(true);
  }

  // -------------------------------------------------------

  public getUserRoles(): string[] {
    const userPermissions: string[] | null = this.store.selectSnapshot(
      AuthStoreState.getUserPermissions
    );

    let userRoles: string[] = userPermissions ? userPermissions : [];

    userRoles = [...userRoles].filter(
      (role) => role !== 'IS_AUTHENTICATED' && role !== 'IS_ANONYMOUS'
    );

    const isLogged = this.store.selectSnapshot(AuthStoreState.getIsLogged);

    if (isLogged && userRoles.indexOf('IS_AUTHENTICATED') === -1) {
      userRoles.push('IS_AUTHENTICATED');
    }

    if (!isLogged && userRoles.indexOf('IS_ANONYMOUS') === -1) {
      userRoles.push('IS_ANONYMOUS');
    }

    return userRoles;
  }

  public hasPermission(role: string): boolean {
    return this.hasPermissions([role], 'and');
  }

  public hasPermissions(roles: string[], aggregator = 'and'): boolean {
    if (roles.length === 0) {
      return true;
    }
    const userRoles = this.getUserRoles();

    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    const allRoles = aggregator === 'and';

    let hasAllRoles = allRoles;

    roles.forEach((role) => {
      if (allRoles) {
        hasAllRoles =
          hasAllRoles && userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
      } else {
        hasAllRoles =
          hasAllRoles || userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
      }
    });

    return hasAllRoles;
  }

  // -------------------------------------------------------

  public isLogged(): boolean {
    return this.store.selectSnapshot(AuthStoreState.getIsLogged) === true;
  }

  public isAdmin(): boolean {
    return this.hasPermission('ROLE_ADMIN');
  }

  public getUserName(): string | null {
    return this.store.selectSnapshot(AuthStoreState.getUserName);
  }

  // -------------------------------------------------------
}
