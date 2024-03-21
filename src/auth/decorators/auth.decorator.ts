import { UseGuards, applyDecorators } from '@nestjs/common';
import { type DuacoderRole } from '../../common/enums/duacoder-role.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Auth = (role: DuacoderRole) => {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
};
