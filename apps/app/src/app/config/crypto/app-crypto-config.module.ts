import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import {
  AppCoreUtilCryptoModule,
  UTIL_CRYPTO_SECRET_KEY_TOKEN
} from '@project/app-core-util-crypto';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { APP_ENV_CONFIG } from '../_variables/app.env.config';

@NgModule({
  declarations: [],
  imports: [
    // ---------------------
    CommonModule,
    // ---------------------
    AppCoreUtilCryptoModule
    // ---------------------
  ],
  providers: [
    {
      provide: UTIL_CRYPTO_SECRET_KEY_TOKEN,
      useValue: APP_ENV_CONFIG.crypto.secret
    }
  ]
})
export class AppCryptoConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppCryptoConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppCryptoConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');
  }
}
