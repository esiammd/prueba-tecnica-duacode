import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value.toUpperCase())
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
