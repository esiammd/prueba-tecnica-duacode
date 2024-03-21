import { type CustomDecorator, SetMetadata } from '@nestjs/common';
import { type DuacoderRole } from '../../common/enums/duacoder-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (role: DuacoderRole): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, role);
