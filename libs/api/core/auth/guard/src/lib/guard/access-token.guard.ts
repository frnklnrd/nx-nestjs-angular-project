import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ACCESS_TOKEN_STRATEGY_KEY,
  SKIP_ACCESS_TOKEN_GUARD_KEY,
} from '@project/api-core-auth-api';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY_KEY) {
  protected readonly logger = new Logger(AccessTokenGuard.name);

  constructor(protected readonly reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext) {
    this.logger.debug('canActivate - init');

    const skipAccessTokenGuard = this.reflector.getAllAndOverride<boolean>(
      SKIP_ACCESS_TOKEN_GUARD_KEY,
      [context.getHandler(), context.getClass()]
    );

    this.logger.debug('skipAccessTokenGuard', {
      skipAccessTokenGuard: !!skipAccessTokenGuard,
    });

    if (skipAccessTokenGuard) {
      this.logger.debug('canActivate - end');
      return true;
    }

    const superCanActivate = await super.canActivate(context);

    this.logger.debug('superCanActivate', superCanActivate);

    this.logger.debug('canActivate - end');

    return superCanActivate instanceof Observable
      ? firstValueFrom(superCanActivate)
      : superCanActivate;
  }
}
