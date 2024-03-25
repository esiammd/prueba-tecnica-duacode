import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from '../../common/dto/pagination-filter.dto';

export class SkillFilterDto extends PaginationFilterDto {
  @IsString()
  @IsOptional()
  name?: string;
}
