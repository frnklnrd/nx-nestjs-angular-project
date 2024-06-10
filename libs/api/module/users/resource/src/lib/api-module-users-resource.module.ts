import { Module } from '@nestjs/common';
import { ApiModuleUsersServiceModule } from '@project/api-module-users-service';
import { UsersController } from './controller/users.controller';

@Module({
  imports: [ApiModuleUsersServiceModule],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class ApiModuleUsersResourceModule {}
