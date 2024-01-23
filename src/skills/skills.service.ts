import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const skillExist = await this.skillRepository.findOneBy({
      name: createSkillDto.name,
    });

    if (skillExist) {
      throw new ConflictException('Skill already exists');
    }

    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    await this.skillRepository.update(id, updateSkillDto);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const skill = await this.findOne(id);

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    await this.skillRepository.delete(id);
  }
}
