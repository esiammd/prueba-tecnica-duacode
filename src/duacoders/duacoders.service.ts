import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { type CreateDuacoderDto } from './dto/create-duacoder.dto';
import { type UpdateDuacoderDto } from './dto/update-duacoder.dto';
import { Duacoder } from './entities/duacoder.entity';

import { Department } from '../departments/entities/department.entity';
import { Position } from '../positions/entities/position.entity';
import { Skill } from '../skills/entities/skill.entity';
import { DuacoderRole } from 'src/common/enums/duacoder-role.enum';

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
    await this.validateRole(createDuacoderDto.role);
    await this.validateNif(createDuacoderDto.nif);
    await this.validateEmail(createDuacoderDto.email);

    console.log(createDuacoderDto);

    const newDuacoder = this.duacoderRepository.create({
      ...createDuacoderDto,
      password: await bcryptjs.hash(createDuacoderDto.password, 10),
      department: createDuacoderDto.departmentId
        ? await this.validateDepartment(createDuacoderDto.departmentId)
        : undefined,
      position: createDuacoderDto.positionId
        ? await this.validatePosition(createDuacoderDto.positionId)
        : undefined,
      skills: createDuacoderDto.skillIds
        ? await this.validateSkills(createDuacoderDto.skillIds)
        : undefined,
    });
    return await this.duacoderRepository
      .save(newDuacoder)
      .then(async response => await this.findOne(response.id));
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

  async findOneByEmail(email: string): Promise<Duacoder> {
    const duacoder = await this.duacoderRepository.findOneBy({ email });

    return duacoder;
  }

  async update(
    id: string,
    updateDuacoderDto: UpdateDuacoderDto,
  ): Promise<Duacoder> {
    await this.validateRole(updateDuacoderDto.role);

    const duacoder = await this.findOne(id);

    await this.compareNif(updateDuacoderDto.nif, duacoder.nif);
    await this.compareEmail(updateDuacoderDto.email, duacoder.email);

    const newDuacoder = {
      ...duacoder,
      ...updateDuacoderDto,
      password: updateDuacoderDto.password
        ? await bcryptjs.hash(updateDuacoderDto.password, 10)
        : undefined,
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

    return await this.duacoderRepository
      .save(newDuacoder)
      .then(async response => await this.findOne(response.id));
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.duacoderRepository.delete(id);
  }

  private async validateRole(role: string): Promise<void> {
    if (role && !DuacoderRole[role.toUpperCase()]) {
      throw new NotFoundException('Role not found');
    }
  }

  private async validateNif(nif: string): Promise<void> {
    const nifExist = await this.duacoderRepository.findOneBy({ nif });

    if (nifExist) {
      throw new ConflictException('NIF already registered');
    }
  }

  private async validateEmail(email: string): Promise<void> {
    const emailExist = await this.findOneByEmail(email);

    if (emailExist) {
      throw new ConflictException('Email already registered');
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

  private async compareNif(newNif: string, oldNif: string): Promise<void> {
    if (newNif && newNif !== oldNif) {
      const nifExists = await this.duacoderRepository.findOneBy({
        nif: newNif,
      });

      if (nifExists) {
        throw new ConflictException('NIF belongs to another duacode');
      }
    }
  }

  private async compareEmail(
    newEmail: string,
    oldEmail: string,
  ): Promise<void> {
    if (newEmail && newEmail !== oldEmail) {
      const emailExists = await this.duacoderRepository.findOneBy({
        email: newEmail,
      });

      if (emailExists) {
        throw new ConflictException('Email belongs to another duacode');
      }
    }
  }
}
