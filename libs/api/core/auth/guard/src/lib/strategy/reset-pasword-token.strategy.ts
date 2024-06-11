import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { RESET_PASSWORD_STRATEGY_KEY } from '@project/api-core-auth-api';
import { AuthService } from '@project/api-core-auth-service';
import { CryptoUtilService } from '@project/api-core-util-crypto';
import { UsersService } from '@project/api-module-users-service';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtPayload = {
  username: string;
};

@Injectable()
export class ResetPasswordTokenStrategy extends PassportStrategy(
  Strategy,
  RESET_PASSWORD_STRATEGY_KEY
) {
  protected readonly logger = new Logger(ResetPasswordTokenStrategy.name);

  constructor(
    protected readonly authService: AuthService,
    protected readonly usersService: UsersService,
    protected readonly cryptoUtilService: CryptoUtilService
  ) {
    super(cryptoUtilService.getResetPasswordTokenStrategyConfig());
  }

  async validate(request: Request, payload: JwtPayload) {
    this.logger.debug('validate - init');

    this.logger.debug('payload', { payload });

    const resetPasswordToken = this.extractTokenFromHeader(request);

    this.logger.debug('resetPasswordToken', {
      resetPasswordToken
    });

    if (!resetPasswordToken) {
      this.logger.error('Bearer Reset Password Token not provided');
      throw new UnauthorizedException('Access Denied');
    }

    try {
      /*
      const payload =
        await this.cryptoUtilService.verifyAsyncWithResetPasswordConfig(
          resetPasswordToken
        );

      this.logger.debug('payload', { payload });

      if (!payload) {
        this.logger.error('Payload error or expired');
        throw new UnauthorizedException('Access Denied');
      }
      */

      let user = null;

      if (payload.username) {
        user = await this.usersService.findByUsername(payload.username);
      }

      if (!user && payload.username) {
        user = await this.usersService.findByEmail(payload.username);
      }

      this.logger.debug('user', {
        id: user?.id,
        isActive: user?.isActive,
        isBlocked: user?.isBlocked
      });

      if (!user || !user?.isActive || user.isBlocked) {
        throw new UnauthorizedException('Access Denied');
      }

      /*
      if (user.isAdmin) {
        this.logger.error('User Admin not allowed to change password');
        throw new UnauthorizedException(
          'User Admin not allowed to change password'
        );
      }
      */

      const userTokens = await this.authService.findUserTokensById(
        payload.username
      );

      this.logger.debug('resetPasswordToken', {
        resetPasswordToken: userTokens?.resetPasswordToken
      });

      if (!userTokens?.resetPasswordToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const resetPasswordTokenMatches =
        await this.cryptoUtilService.compareTokenData(
          resetPasswordToken as string,
          userTokens?.resetPasswordToken as string
        );

      this.logger.debug('resetPasswordTokenMatches:', {
        resetPasswordTokenMatches
      });

      if (!resetPasswordTokenMatches)
        throw new UnauthorizedException('Invalid Reset Password Token');

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      (request as any)['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    this.logger.debug('validate - end');

    return { ...payload, resetPasswordToken };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
