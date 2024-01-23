import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { type Skill } from './entities/skill.entity';
import { type DeleteResult, type UpdateResult } from 'typeorm';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return await this.skillsService.create(createSkillDto);
  }

  @Get()
  async findAll(): Promise<Skill[]> {
    return await this.skillsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Skill> {
    return await this.skillsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<UpdateResult> {
    return await this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.skillsService.remove(id);
  }
}
