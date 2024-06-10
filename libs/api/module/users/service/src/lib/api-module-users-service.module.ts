import { Module } from '@nestjs/common';
import { ApiCoreUtilCryptoModule } from '@project/api-core-util-crypto';
import { ApiModuleUsersModelModule } from '@project/api-module-users-model';
import { UsersService } from './service/users.service';

@Module({
  imports: [ApiCoreUtilCryptoModule, ApiModuleUsersModelModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class ApiModuleUsersServiceModule {}
