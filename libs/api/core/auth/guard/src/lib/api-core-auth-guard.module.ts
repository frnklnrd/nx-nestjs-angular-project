import { Module } from '@nestjs/common';
import { ApiCoreAuthServiceModule } from '@project/api-core-auth-service';
import { ApiCoreUtilCryptoModule } from '@project/api-core-util-crypto';
import { ApiModuleUsersServiceModule } from '@project/api-module-users-service';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { ResetPasswordTokenStrategy } from './strategy/reset-pasword-token.strategy';

@Module({
  imports: [
    ApiCoreUtilCryptoModule,
    ApiModuleUsersServiceModule,
    ApiCoreAuthServiceModule,
  ],
  controllers: [],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ResetPasswordTokenStrategy,
  ],
  exports: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ResetPasswordTokenStrategy,
  ],
})
export class ApiCoreAuthGuardModule {}
