import { Module } from '@nestjs/common';
import { ApiCoreAuthModelModule } from '@project/api-core-auth-model';
import { ApiCoreUtilCryptoModule } from '@project/api-core-util-crypto';
import { ApiCoreUtilMailerModule } from '@project/api-core-util-mailer';
import { ApiModuleUsersModelModule } from '@project/api-module-users-model';
import { ApiModuleUsersServiceModule } from '@project/api-module-users-service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ApiCoreUtilCryptoModule,
    ApiCoreUtilMailerModule,
    ApiCoreAuthModelModule,
    ApiModuleUsersModelModule,
    ApiModuleUsersServiceModule
  ],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService]
})
export class ApiCoreAuthServiceModule {}
