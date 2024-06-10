import { Module } from '@nestjs/common';
import { ApiModuleUsersModelModule } from '@project/api-module-users-model';
import { ApiModuleUsersResourceModule } from '@project/api-module-users-resource';

@Module({
  imports: [
    // ----------------------
    // Users
    // ----------------------
    ApiModuleUsersModelModule,
    ApiModuleUsersResourceModule,
    // ----------------------
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppResourcesModule {}
