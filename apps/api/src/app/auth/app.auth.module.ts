import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  AccessTokenGuard,
  ApiCoreAuthGuardModule,
} from '@project/api-core-auth-guard';
import { ApiCoreAuthModelModule } from '@project/api-core-auth-model';
import { ApiCoreAuthResourceModule } from '@project/api-core-auth-resource';

@Global()
@Module({
  imports: [
    //-------------------------------------
    ApiCoreAuthModelModule,
    ApiCoreAuthResourceModule,
    //-------------------------------------
    ApiCoreAuthGuardModule,
    //-------------------------------------
  ],

  providers: [
    //-------------------------------------
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    /*{
      provide: APP_GUARD,
      useClass: CheckPermissionGuard,
    },*/
    //-------------------------------------
  ],
  exports: [],
})
export class AppAuthModule {}
