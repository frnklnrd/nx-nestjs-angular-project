import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CheckPermission } from '@project/api-core-auth-decorator';

@Injectable()
export class CheckPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get(
      CheckPermission,
      context.getHandler()
    );
    if (!permissions || permissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const match = this.matchPermission(permissions, user.permissions);

    if (!match) {
      throw new UnauthorizedException();
    }

    return true;
  }

  matchPermission(permissions: string[], userPermissions: string[]): boolean {
    let match = true;
    permissions.forEach((permission) => {
      const find = userPermissions.find(
        (el) => el.toLocaleUpperCase() === permission.toLocaleUpperCase()
      );
      if (!find) {
        match = false;
      }
    });
    return match;
  }
}
