import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_KEY } from '@project/api-core-auth-api';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY_KEY) {
  protected readonly logger = new Logger(RefreshTokenGuard.name);

  constructor() {
    super();
  }

  override async canActivate(context: ExecutionContext) {
    this.logger.debug('canActivate - init');

    const superCanActivate = await super.canActivate(context);

    this.logger.debug('superCanActivate', superCanActivate);

    this.logger.debug('canActivate - end');

    return superCanActivate instanceof Observable
      ? firstValueFrom(superCanActivate)
      : superCanActivate;
  }
}
