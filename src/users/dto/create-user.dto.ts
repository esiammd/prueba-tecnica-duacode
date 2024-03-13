import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/auth/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: UserRole;
}
