import { type CustomDecorator, SetMetadata } from '@nestjs/common';
import { type UserRole } from '../../common/enums/user-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (role: UserRole): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, role);
