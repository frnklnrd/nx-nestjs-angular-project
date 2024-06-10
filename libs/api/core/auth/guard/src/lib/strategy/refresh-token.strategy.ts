import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_KEY } from '@project/api-core-auth-api';
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
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY_KEY
) {
  protected readonly logger = new Logger(RefreshTokenStrategy.name);

  constructor(
    protected readonly authService: AuthService,
    protected readonly usersService: UsersService,
    protected readonly cryptoUtilService: CryptoUtilService
  ) {
    super(cryptoUtilService.getRefreshTokenStrategyConfig());
  }

  async validate(request: Request, payload: JwtPayload) {
    this.logger.debug('validate - init');

    this.logger.debug('payload', { payload });

    const refreshToken = this.extractTokenFromHeader(request);

    this.logger.debug('refreshToken', {
      refreshToken,
    });

    if (!refreshToken) {
      this.logger.error('Bearer Refresh Token not provided');
      throw new UnauthorizedException('Access Denied');
    }

    try {
      /*
      const payload =
        await this.cryptoUtilService.verifyAsyncWithRefreshTokenConfig(
          refreshToken
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
        isBlocked: user?.isBlocked,
      });

      if (!user || !user?.isActive || user.isBlocked) {
        throw new UnauthorizedException('Access Denied');
      }

      const userTokens = await this.authService.findUserTokensById(payload.sub);

      this.logger.debug('refreshToken', {
        refreshToken: userTokens?.refreshToken,
      });

      if (!userTokens?.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const refreshTokenMatches = await this.cryptoUtilService.compareTokenData(
        refreshToken as string,
        userTokens?.refreshToken as string
      );

      this.logger.debug('refreshTokenMatches:', {
        refreshTokenMatches,
      });

      if (!refreshTokenMatches)
        throw new UnauthorizedException('Invalid Refresh Token');

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      (request as any)['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    this.logger.debug('validate - end');

    return { ...payload, refreshToken };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
