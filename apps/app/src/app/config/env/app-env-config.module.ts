import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import {
  ConfigUtilService,
  AppCoreUtilConfigModule
} from '@project/app-core-util-config';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { APP_ENV_CONFIG } from '../_variables/app.env.config';

@NgModule({
  declarations: [],
  imports: [
    // ---------------------
    CommonModule,
    // ---------------------
    AppCoreUtilConfigModule
    // ---------------------
  ],
  providers: [],
  exports: []
})
export class AppEnvConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppEnvConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppEnvConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    this.configService.set<any>('app', APP_ENV_CONFIG.app);
  }
}
