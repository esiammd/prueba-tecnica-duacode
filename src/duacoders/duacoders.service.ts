import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type CreateDuacoderDto } from './dto/create-duacoder.dto';
import { type UpdateDuacoderDto } from './dto/update-duacoder.dto';
import { Duacoder } from './entities/duacoder.entity';

import { Department } from '../departments/entities/department.entity';
import { Position } from '../positions/entities/position.entity';
import { Skill } from '../skills/entities/skill.entity';

@Injectable()
export class DuacodersService {
  constructor(
    @InjectRepository(Duacoder)
    private readonly duacoderRepository: Repository<Duacoder>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createDuacoderDto: CreateDuacoderDto): Promise<Duacoder> {
    await this.validateDuacoder(createDuacoderDto.nif);

    const department = await this.validateDepartment(
      createDuacoderDto.departmentId,
    );

    const position = await this.validatePosition(createDuacoderDto.positionId);

    const skills = await this.validateSkills(createDuacoderDto.skillIds);

    const duacoder = this.duacoderRepository.create({
      ...createDuacoderDto,
      department,
      position,
      skills,
    });
    return await this.duacoderRepository.save(duacoder);
  }

  async findAll(page: number = 1, limit: number = 3): Promise<Duacoder[]> {
    return await this.duacoderRepository.find();
  }

  async findOne(id: string): Promise<Duacoder> {
    const duacoder = await this.duacoderRepository.findOneBy({ id });

    if (!duacoder) {
      throw new NotFoundException('Duacoder not found');
    }

    return duacoder;
  }

  async update(
    id: string,
    updateDuacoderDto: UpdateDuacoderDto,
  ): Promise<Duacoder> {
    const duacoder = await this.findOne(id);

    await this.validateNif(updateDuacoderDto.nif, duacoder.nif);

    const newDuacoder = {
      ...duacoder,
      ...updateDuacoderDto,
      department: updateDuacoderDto.departmentId
        ? await this.validateDepartment(updateDuacoderDto.departmentId)
        : undefined,
      position: updateDuacoderDto.positionId
        ? await this.validatePosition(updateDuacoderDto.positionId)
        : undefined,
      skills: updateDuacoderDto.skillIds
        ? await this.validateSkills(updateDuacoderDto.skillIds)
        : undefined,
    };
    delete newDuacoder.skillIds;

    return await this.duacoderRepository.save(newDuacoder);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.duacoderRepository.delete(id);
  }

  private async validateDuacoder(nif: string): Promise<void> {
    const duacoderExist = await this.duacoderRepository.findOneBy({ nif });

    if (duacoderExist) {
      throw new ConflictException('Duacoder already exists');
    }
  }

  private async validateDepartment(departmentId: string): Promise<Department> {
    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  private async validatePosition(positionId: string): Promise<Position> {
    const position = await this.positionRepository.findOneBy({
      id: positionId,
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    return position;
  }

  private async validateSkills(skillIds: string[]): Promise<Skill[]> {
    const skills = await Promise.all(
      skillIds.map(async skillId => {
        const skillExist = await this.skillRepository.findOneBy({
          id: skillId,
        });

        if (!skillExist) {
          throw new NotFoundException(`Skill ${skillId} not found`);
        }

        return skillExist;
      }),
    );

    return skills;
  }

  private async validateNif(newNif: string, oldNif: string): Promise<void> {
    if (newNif && newNif !== oldNif) {
      const nifExists = await this.duacoderRepository.findOneBy({
        nif: newNif,
      });

      if (nifExists) {
        throw new ConflictException('NIF belongs to another duacode');
      }
    }
  }
}
