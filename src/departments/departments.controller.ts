import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { DuacoderRole } from '../common/enums/duacoder-role.enum';
import { DepartmentFilterDto } from './dto/department-filter.dto';

@ApiTags('departments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
@ApiForbiddenResponse({ description: 'Forbidden access.' })
@Auth(DuacoderRole.ADMIN)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Department created successfully.',
    type: Department,
  })
  @ApiConflictResponse({ description: 'Department already exists.' })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return await this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List all departments.',
    type: Department,
    isArray: true,
  })
  async findAll(
    @Query() { page, limit, ...filters }: DepartmentFilterDto,
  ): Promise<Department[]> {
    return await this.departmentsService.findAll({
      limit,
      offset: (page - 1) * limit,
      ...filters,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Displays the requested department.',
    type: Department,
  })
  @ApiNotFoundResponse({ description: 'Department not found.' })
  async findOne(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Department updated successfully.',
    type: Department,
  })
  @ApiConflictResponse({ description: 'Department already exists.' })
  @ApiNotFoundResponse({ description: 'Department not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return await this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Department successfully removed.' })
  @ApiNotFoundResponse({ description: 'Department not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.departmentsService.remove(id);
  }
}
