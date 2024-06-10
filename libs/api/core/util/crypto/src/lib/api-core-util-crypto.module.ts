import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CryptoUtilService } from './service/crypto-util.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>(
            'jwt.access_token.secret'
          ) as string,
          signOptions: {
            expiresIn: configService.get<string>('jwt.expires_in') as string,
            // algorithm: 'HS256',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    //-------------------------------------
    CryptoUtilService,
    //-------------------------------------
  ],
  exports: [CryptoUtilService, JwtModule],
})
export class ApiCoreUtilCryptoModule {}
