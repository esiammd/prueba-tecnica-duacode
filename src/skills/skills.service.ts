import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type DeleteResult, Repository, type UpdateResult } from 'typeorm';

import { type CreateSkillDto } from './dto/create-skill.dto';
import { type UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find();
  }

  async findOne(id: string): Promise<Skill> {
    return await this.skillRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<UpdateResult> {
    return await this.skillRepository.update(id, updateSkillDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.skillRepository.delete(id);
  }
}
