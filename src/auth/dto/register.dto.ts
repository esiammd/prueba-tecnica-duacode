import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { DuacoderRole } from 'src/common/enums/duacoder-role.enum';

export class RegisterDto {
  @IsString()
  nif: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: DuacoderRole;

  @IsBoolean()
  tortillaWithOnion: boolean;
}
