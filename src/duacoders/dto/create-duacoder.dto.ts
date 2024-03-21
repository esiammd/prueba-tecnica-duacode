import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { DuacoderRole } from 'src/common/enums/duacoder-role.enum';

export class CreateDuacoderDto {
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

  @IsString()
  @IsOptional()
  biography?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  positionId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  skillIds?: string[];

  @IsString()
  @IsOptional()
  photo?: string;

  @IsBoolean()
  tortillaWithOnion: boolean;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'yyyy-mm-dd' })
  dateOfBirth?: string;
}
