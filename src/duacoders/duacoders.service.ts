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

import { Department } from 'src/departments/entities/department.entity';
import { Position } from 'src/positions/entities/position.entity';
import { Skill } from 'src/skills/entities/skill.entity';

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
    const duacoderExist = await this.duacoderRepository.findOneBy({
      nif: createDuacoderDto.nif,
    });

    if (duacoderExist) {
      throw new ConflictException('Duacoder already exists');
    }

    const department = await this.departmentRepository.findOneBy({
      id: createDuacoderDto.departmentId,
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const position = await this.positionRepository.findOneBy({
      id: createDuacoderDto.positionId,
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    const skills = await Promise.all(
      createDuacoderDto.skillIds.map(async skillId => {
        const skillExist = await this.skillRepository.findOneBy({
          id: skillId,
        });

        if (!skillExist) {
          throw new NotFoundException(`Skill ${skillId} not found`);
        }

        return skillExist;
      }),
    );

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

    if (!duacoder) {
      throw new NotFoundException('Duacoder not found');
    }

    if (updateDuacoderDto.nif && updateDuacoderDto.nif !== duacoder.nif) {
      const nifExists = await this.duacoderRepository.findOneBy({
        nif: updateDuacoderDto.nif,
      });

      if (nifExists) {
        throw new ConflictException('NIF belongs to another duacode');
      }
    }

    let newDuacoder = { ...duacoder, ...updateDuacoderDto };

    if (updateDuacoderDto.departmentId) {
      const department = await this.departmentRepository.findOneBy({
        id: updateDuacoderDto.departmentId,
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      newDuacoder = { ...newDuacoder, department };
    }

    if (updateDuacoderDto.positionId) {
      const position = await this.positionRepository.findOneBy({
        id: updateDuacoderDto.positionId,
      });

      if (!position) {
        throw new NotFoundException('Position not found');
      }

      newDuacoder = { ...newDuacoder, position };
    }

    if (updateDuacoderDto.skillIds) {
      const skills = await Promise.all(
        updateDuacoderDto.skillIds.map(async skill => {
          const skillExist = await this.skillRepository.findOneBy({
            id: skill,
          });

          if (!skillExist) {
            throw new NotFoundException(`Skill '${skill}' not found`);
          }

          return skillExist;
        }),
      );

      newDuacoder = { ...newDuacoder, skills };
      delete newDuacoder.skillIds;
    }

    return await this.duacoderRepository.save(newDuacoder);
  }

  async remove(id: string): Promise<void> {
    const duacoder = await this.findOne(id);

    if (!duacoder) {
      throw new NotFoundException('Duacoder not found');
    }

    await this.duacoderRepository.softDelete(id);
  }
}
