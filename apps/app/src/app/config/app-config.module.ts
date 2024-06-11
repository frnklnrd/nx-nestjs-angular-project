import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { AppApiConfigModule } from './api/app-api-config.module';
import { AppAuthConfigModule } from './auth/app-auth-config.module';
import { AppCoreConfigModule } from './core/app-core.module';
import { AppCryptoConfigModule } from './crypto/app-crypto-config.module';
import { AppEnvConfigModule } from './env/app-env-config.module';
import { AppFlowConfigModule } from './flow/app-flow-config.module';
import { AppGoogleConfigModule } from './google/app-google-config.module';
import { AppI18nConfigModule } from './i18n/app-i18n-config.module';
import { AppLoaderConfigModule } from './loader/app-loader-config.module';
import { AppLoggerConfigModule } from './logger/app-logger-config.module';
import { AppStoreConfigModule } from './store/app-store-config.module';

@NgModule({
  declarations: [],
  imports: [
    // ---------------------
    // Logger
    // ---------------------
    AppLoggerConfigModule,
    // ---------------------
    // Crypto
    // ---------------------
    AppCryptoConfigModule,
    // ---------------------
    // Store
    // ---------------------
    AppStoreConfigModule,
    // ---------------------
    // Config
    // ---------------------
    AppEnvConfigModule,
    // ---------------------
    // Loader
    // ---------------------
    AppLoaderConfigModule,
    // ---------------------
    // Api
    // ---------------------
    AppApiConfigModule,
    // ---------------------
    // I18n
    // ---------------------
    AppI18nConfigModule,
    // ---------------------
    // Google
    // ---------------------
    AppGoogleConfigModule,
    // ---------------------
    // Flow
    // ---------------------
    AppFlowConfigModule,
    // ---------------------
    // Auth
    // ---------------------
    AppAuthConfigModule,
    // ---------------------
    // App Core
    // ---------------------
    AppCoreConfigModule
    // ---------------------
  ],
  providers: [],
  exports: [AppLoaderConfigModule]
})
export class AppConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');
  }
}
