import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';

import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import {
  AuthLoginOkStoreAction,
  AuthLogoutOkStoreAction,
  AuthStoreState,
  NotifyCheckingAuthTokenValidStoreAction
} from '@project/app-core-auth-store';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { take, timer } from 'rxjs';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthApiService } from '@project/api-client-ng-api-connector';
import {
  HttpRequestAppendHeadersToApiCallInterceptor,
  HttpResponseAuthorizationErrorInterceptor
} from '@project/app-core-auth-interceptor';
import {
  AppCoreAuthCoreServiceModule,
  AuthCoreService
} from '@project/app-core-auth-service';
import { ConfigUtilService } from '@project/app-core-util-config';
import { APP_ROUTES_CONFIG } from '../_variables/app.routes.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
    AppCoreAuthCoreServiceModule
    // ----------------
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestAppendHeadersToApiCallInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseAuthorizationErrorInterceptor,
      multi: true
    }
    // TODO remove
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  exports: []
})
export class AppAuthConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly auth: AuthCoreService =
    inject<AuthCoreService>(AuthCoreService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  protected readonly authApiService: AuthApiService =
    inject<AuthApiService>(AuthApiService);

  protected readonly store: Store = inject<Store>(Store);

  protected readonly actions$: Actions = inject<Actions>(Actions);

  protected router: Router = inject<Router>(Router);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppAuthConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppAuthConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    this.actions$
      .pipe(ofActionDispatched(AuthLoginOkStoreAction))
      .subscribe((action: AuthLoginOkStoreAction) => {
        if (action.loggedIn) {
          this.logger.console.debug('Logged -> In !!!', action.loggedIn);
          this.router.navigate([APP_ROUTES_CONFIG.APP_DASHBOARD]);
        }
      });

    this.actions$
      .pipe(ofActionDispatched(AuthLogoutOkStoreAction))
      .subscribe((action: AuthLogoutOkStoreAction) => {
        if (action.loggedOut) {
          this.logger.console.debug('Logged -> Out !!!', action.loggedOut);
          this.router.navigate([APP_ROUTES_CONFIG.AUTH_LOGIN]);
        }
      });

    /*
    this.actions$
      .pipe(ofActionDispatched(AuthChangeTokenStoreAction))
      .subscribe((action: AuthChangeTokenStoreAction) => {
        if (action.token) {
          this.logger.console.debug(
            'Token -> Updated !!!',
            action.token
          );
        }
      });
      */

    // check token valid

    timer(0 * 60 * 1000, 3 * 60 * 1000) // timer(1 * 5 * 1000, 1 * 10 * 1000)
      .subscribe(() => {
        this.logger.console.debug('Verifying Access Token Valid');

        this.notifyCheckingAuthTokenValidInit();

        const isLogged = this.store.selectSnapshot(AuthStoreState.getIsLogged);

        this.logger.console.debug('Verifying if user is logged', isLogged);

        if (!isLogged) {
          if (this.router.url !== APP_ROUTES_CONFIG.AUTH_LOGIN) {
            this.notifyCheckingAuthTokenValidEnd();
            // this.auth.dispatchLogoutOk();
          }
          this.notifyCheckingAuthTokenValidEnd();
          return;
        }

        this.logger.console.debug('Verifying Access Token Expiration Date');

        const accessTokenExpirationDate: Date | null =
          this.store.selectSnapshot(AuthStoreState.getAccessTokenExpiresAt);

        this.logger.console.debug(
          'Access Token expires at: ',
          accessTokenExpirationDate?.toISOString()
        );

        if (!accessTokenExpirationDate) {
          this.notifyCheckingAuthTokenValidEnd();
          this.auth.dispatchLogoutOk();
          return;
        }

        const now: number = Date.now();

        const atExpiresAt: number = accessTokenExpirationDate.getTime();

        const atDiff = atExpiresAt - now;

        this.logger.console.debug(
          'Access Token expires in: ',
          Number.parseInt('' + atDiff / 1000 / 60) + ' minutes'
        );

        if (atDiff > 5 * 60 * 1000) {
          this.logger.console.debug('Access Token OK!!!');
          if (
            !this.authApiService.configuration.accessToken &&
            this.authApiService.configuration.accessToken === ''
          ) {
            const accessToken: string | null = this.store.selectSnapshot(
              AuthStoreState.getAccessTokenValue
            );
            this.authApiService.configuration.accessToken =
              accessToken as string;
          }
          this.notifyCheckingAuthTokenValidEnd();
          return;
        }

        /*
        if (atDiff >= 1 * 60 * 1000) {
          this.logger.console.debug('Trying to Refresh Access Token');
          this.auth.refreshToken().subscribe((response) => {
            this.logger.console.debug('Access Token refreshed', response);
          });
          return;
        }
        */

        this.logger.console.debug('Verifying Refresh Token Expiration Date');

        const refreshTokenExpirationDate: Date | null =
          this.store.selectSnapshot(AuthStoreState.getRefreshTokenExpiresAt);

        this.logger.console.debug(
          'Refresh Token expires at: ',
          refreshTokenExpirationDate?.toISOString()
        );

        if (!refreshTokenExpirationDate) {
          this.notifyCheckingAuthTokenValidEnd();
          this.auth.dispatchLogoutOk();
          return;
        }

        const rtExpiresAt: number = refreshTokenExpirationDate.getTime();

        const rtDiff = rtExpiresAt - now;

        this.logger.console.debug(
          'Refresh Token expires in: ',
          Number.parseInt('' + rtDiff / 1000 / 60) + ' minutes'
        );

        if (rtDiff >= 5 * 60 * 1000) {
          this.logger.console.debug('Refresh Token OK!!!');
          this.logger.console.debug('Trying to Refresh Access Token');
          this.auth
            .refreshToken()
            .pipe(take(1))
            .subscribe({
              next: (response) => {
                this.logger.console.debug('Access Token refreshed', response);
                this.notifyCheckingAuthTokenValidEnd();
              },
              error: (error) => {
                this.logger.console.debug('Access Token NOT refreshed', error);
                this.notifyCheckingAuthTokenValidEnd();
                this.auth.dispatchLogoutOk();
              }
            });
          return;
        }

        this.logger.console.debug('Refresh Token Not OK!!!');

        this.notifyCheckingAuthTokenValidEnd();
        this.auth.dispatchLogoutOk();
        return;
      });
  }

  // -------------------------------------------------------

  private notifyCheckingAuthTokenValidInit(): void {
    this.logger.console.debug('Checking AuthToken Valid', true);

    this.store.dispatch(new NotifyCheckingAuthTokenValidStoreAction(true));
  }

  private notifyCheckingAuthTokenValidEnd(): void {
    this.logger.console.debug('Checking AuthToken Valid', false);
    setTimeout(() => {
      this.store.dispatch(new NotifyCheckingAuthTokenValidStoreAction(false));
    }, 0);
  }

  // -------------------------------------------------------
}
