import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import {
  BASE_PATH as API_CLIENT_BASE_PATH,
  Configuration,
  ApiClientNgApiConnectorModule
} from '@project/api-client-ng-api-connector';
import { HttpResponseInternalServerErrorInterceptor } from '@project/app-core-api';
import { ConfigUtilService } from '@project/app-core-util-config';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { APP_ENV_CONFIG } from '../_variables/app.env.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ----------------
    HttpClientModule,
    // ----------------
    // App Api Modules
    // ----------------
    ApiClientNgApiConnectorModule
    // ----------------
  ],
  providers: [
    // ----------------
    // App Api Providers
    // ----------------
    {
      provide: API_CLIENT_BASE_PATH,
      useValue: APP_ENV_CONFIG.api.base_path
    },
    // ----------------
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInternalServerErrorInterceptor,
      multi: true
    }
  ],
  exports: []
})
export class AppApiConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  protected readonly apiConfiguration: Configuration =
    inject<Configuration>(Configuration);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppApiConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppApiConfigModule.name +
          'is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    this.configService.set<any>('api', APP_ENV_CONFIG.api);

    this.logger.console.debug('api.base_path', APP_ENV_CONFIG.api.base_path);

    this.apiConfiguration.basePath = APP_ENV_CONFIG.api.base_path;
  }
}
