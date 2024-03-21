import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { DuacoderRole } from '../../common/enums/duacoder-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<DuacoderRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole) {
      return true;
    }

    const { duacoder } = context.switchToHttp().getRequest();

    if (duacoder.role === DuacoderRole.ADMIN) {
      return true;
    }

    return requiredRole === duacoder.role;
  }
}
