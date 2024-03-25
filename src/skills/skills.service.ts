import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, type ObjectLiteral, Repository } from 'typeorm';

import { type CreateSkillDto } from './dto/create-skill.dto';
import { type UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { type SkillFilterDto } from './dto/skill-filter.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    await this.validateSkill(createSkillDto.name);

    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll({
    limit,
    offset,
    ...filters
  }: SkillFilterDto): Promise<Skill[]> {
    const { name } = filters;
    const whereObj: ObjectLiteral = {};

    if (name) {
      whereObj.name = Like(`%${name}%`);
    }

    return await this.skillRepository
      .createQueryBuilder('skill')
      .where(whereObj)
      .orderBy('skill.name', 'ASC')
      .offset(offset)
      .limit(limit)
      .getMany();
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

    await this.compareSkill(updateSkillDto.name, skill.name);

    await this.skillRepository.update(id, updateSkillDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.skillRepository.delete(id);
  }

  private async validateSkill(name: string): Promise<void> {
    const skillExist = await this.skillRepository.findOneBy({ name });

    if (skillExist) {
      throw new ConflictException('Skill already exists');
    }
  }

  private async compareSkill(
    newSkill: string,
    oldSkill: string,
  ): Promise<void> {
    if (newSkill && newSkill !== oldSkill) {
      const skillExists = await this.skillRepository.findOneBy({
        name: newSkill,
      });

      if (skillExists) {
        throw new ConflictException('Skill belongs to another duacode');
      }
    }
  }
}
