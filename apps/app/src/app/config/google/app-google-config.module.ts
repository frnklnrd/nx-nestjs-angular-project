import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import { ConfigUtilService } from '@project/app-core-util-config';
import { AppCoreUtilGoogleModule } from '@project/app-core-util-google';
import { LoggerUtilService } from '@project/app-core-util-logger';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    AppCoreUtilGoogleModule
    //-----------------
  ],
  providers: [
    //-----------------
  ],
  exports: []
})
export class AppGoogleConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppGoogleConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppGoogleConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    // TODO load api keys from server configuration

    this.configService.set<any>('google', {
      maps: {
        api_key: ''
      },
      translation: {
        api_key: '',
        api_url: 'https://translation.googleapis.com/language/translate/v2'
      }
    });
  }
}
