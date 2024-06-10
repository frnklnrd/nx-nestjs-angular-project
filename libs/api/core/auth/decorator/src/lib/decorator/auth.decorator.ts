import { SetMetadata } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { SKIP_ACCESS_TOKEN_GUARD_KEY } from '@project/api-core-auth-api';

export const SkipAccessTokenGuard = () =>
  SetMetadata(SKIP_ACCESS_TOKEN_GUARD_KEY, true);

export const CheckPermission = Reflector.createDecorator<string[]>();
