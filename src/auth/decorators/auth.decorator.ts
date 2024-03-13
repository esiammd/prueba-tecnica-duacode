import { UseGuards, applyDecorators } from '@nestjs/common';
import { type UserRole } from '../enums/user-role.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Auth = (...roles: UserRole[]) => {
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
};
