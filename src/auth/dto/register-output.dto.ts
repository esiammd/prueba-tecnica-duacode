import { IsDateString, IsEmail, IsString } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterOutputDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role?: UserRole;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
