/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject, isDevMode } from '@angular/core';
import {
  AppCoreUtilLoggerModule,
  LoggerUtilService
} from '@project/app-core-util-logger';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { APP_ENV_CONFIG } from '../_variables/app.env.config';

@NgModule({
  declarations: [],
  imports: [
    // ---------------------
    CommonModule,
    // ---------------------
    LoggerModule.forRoot({
      level: !isDevMode()
        ? NgxLoggerLevel.OFF
        : (APP_ENV_CONFIG.logger.level as NgxLoggerLevel),
      serverLogLevel: !isDevMode()
        ? NgxLoggerLevel.OFF
        : (APP_ENV_CONFIG.logger.server_level as NgxLoggerLevel),
      disableFileDetails: isDevMode(),
      timestampFormat: isDevMode() ? 'HH:mm:ss' : 'YYYY-MM-ddTHH:mm:ss.SSS'
    }),
    // ---------------------
    AppCoreUtilLoggerModule
    // ---------------------
  ],
  providers: [],
  exports: []
})
export class AppLoggerConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppLoggerConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppLoggerConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');
  }
}
