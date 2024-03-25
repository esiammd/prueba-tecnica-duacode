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
  ApiBadRequestResponse,
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

import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { DuacoderRole } from '../common/enums/duacoder-role.enum';
import { SkillFilterDto } from './dto/skill-filter.dto';

@ApiTags('skills')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
@ApiForbiddenResponse({ description: 'Forbidden access.' })
@Auth(DuacoderRole.ADMIN)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Skill created successfully.',
    type: Skill,
  })
  @ApiBadRequestResponse({ description: 'Bad Request Response API.' })
  @ApiConflictResponse({ description: 'Skill already exists.' })
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return await this.skillsService.create(createSkillDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List all skills.',
    type: Skill,
    isArray: true,
  })
  async findAll(
    @Query() { page, limit, ...filters }: SkillFilterDto,
  ): Promise<Skill[]> {
    return await this.skillsService.findAll({
      limit,
      offset: (page - 1) * limit,
      ...filters,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Displays the requested skill.',
    type: Skill,
  })
  async findOne(@Param('id') id: string): Promise<Skill> {
    return await this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Skill updated successfully.',
    type: Skill,
  })
  @ApiConflictResponse({ description: 'Skill already exists.' })
  @ApiNotFoundResponse({ description: 'Skill not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    return await this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Skill successfully removed.' })
  @ApiNotFoundResponse({ description: 'Skill not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.skillsService.remove(id);
  }
}
