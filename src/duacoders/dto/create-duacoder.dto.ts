import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDuacoderDto {
  @IsString()
  nif: string;

  @IsString()
  name: string;

  @IsString()
  biography: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  positionId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  skillIds: string[];

  @IsString()
  photo: string;

  @IsBoolean()
  tortillaWithOnion: boolean;

  @IsDateString()
  @ApiPropertyOptional({ example: 'yyyy-mm-dd' })
  dateOfBirth?: string;
}
