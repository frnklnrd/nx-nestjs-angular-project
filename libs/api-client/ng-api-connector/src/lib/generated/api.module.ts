/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AuthApiService } from './api/auth.service';
import { UsersApiService } from './api/users.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [AuthApiService, UsersApiService],
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration
  ): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error(
        'ApiModule is already loaded. Import in your base AppModule only.'
      );
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
