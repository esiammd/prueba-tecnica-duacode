import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from '../../common/dto/pagination-filter.dto';

export class PositionFilterDto extends PaginationFilterDto {
  @IsString()
  @IsOptional()
  name?: string;
}
