/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ACCESS_TOKEN_STRATEGY_KEY } from '@project/api-core-auth-api';
import { AuthService } from '@project/api-core-auth-service';
import { CryptoUtilService } from '@project/api-core-util-crypto';
import { UsersService } from '@project/api-module-users-service';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_KEY
) {
  protected readonly logger = new Logger(AccessTokenStrategy.name);

  constructor(
    protected readonly authService: AuthService,
    protected readonly usersService: UsersService,
    protected readonly cryptoUtilService: CryptoUtilService
  ) {
    super(cryptoUtilService.getAccessTokenStrategyConfig());
  }

  async validate(request: Request, payload: JwtPayload) {
    this.logger.debug('validate - init');

    this.logger.debug('payload', { payload });

    const accessToken = this.extractTokenFromHeader(request);

    this.logger.debug('accessToken', {
      accessToken
    });

    if (!accessToken) {
      this.logger.error('Bearer Token not provided');
      throw new UnauthorizedException('Access Denied');
    }

    try {
      /*
      const payload =
        await this.cryptoUtilService.verifyAsyncWithAccessTokenConfig(
          accessToken
        );

      this.logger.debug('payload', { payload });

      if (!payload) {
        this.logger.error('Payload error or expired');
        throw new UnauthorizedException('Access Denied');
      }
      */

      const user = await this.usersService.findById(payload.sub);

      this.logger.debug('user', {
        id: user?.id,
        isActive: user?.isActive,
        isBlocked: user?.isBlocked
      });

      if (!user || !user?.isActive || user.isBlocked) {
        throw new UnauthorizedException('Access Denied');
      }

      const userTokens = await this.authService.findUserTokensById(payload.sub);

      this.logger.debug('accessToken', {
        acccessToken: userTokens?.accessToken
      });

      if (!userTokens?.accessToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const accessTokenMatches = await this.cryptoUtilService.compareHashedTokenData(
        accessToken as string,
        userTokens?.accessToken as string
      );

      this.logger.debug('accessTokenMatches:', {
        accessTokenMatches
      });

      if (!accessTokenMatches) {
        throw new UnauthorizedException('Invalid Access Token');
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      (request as any)['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    this.logger.debug('validate - end');

    return payload;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
