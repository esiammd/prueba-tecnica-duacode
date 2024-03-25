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
} from 'class-validator';
import { PaginationFilterDto } from '../../common/dto/pagination-filter.dto';
import { DuacoderRole } from '../../common/enums/duacoder-role.enum';

export class DuacoderFilterDto extends PaginationFilterDto {
  @IsString()
  @IsOptional()
  nif?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: DuacoderRole;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  positionId?: string;

  @Transform(({ value }) => {
    const skillArray = value.split(',').map((skill: string) => skill.trim());
    const uniqueSkills = new Set(skillArray);
    const arrayOfUniqueSkills = Array.from(uniqueSkills);
    return arrayOfUniqueSkills;
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  skillIds?: string[];

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  tortillaWithOnion?: boolean;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'yyyy-mm-dd' })
  dateOfBirth?: string;
}
