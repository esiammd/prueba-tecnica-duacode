import { BadRequestException, Injectable } from '@nestjs/common';
import { type CreatePositionDto } from './dto/create-position.dto';
import { type UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Department } from 'src/departments/entities/department.entity';
import { type DeleteResult, Repository, type UpdateResult } from 'typeorm';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const department = await this.departmentRepository.findOneBy({
      name: createPositionDto.department,
    });

    if (!department) {
      throw new BadRequestException('Department not found');
    }

    const position = this.positionRepository.create({
      ...createPositionDto,
      department,
    });
    return await this.positionRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return await this.positionRepository.find();
  }

  async findOne(id: string): Promise<Position> {
    return await this.positionRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<UpdateResult> {
    const department = await this.departmentRepository.findOneBy({
      name: updatePositionDto.department,
    });

    if (!department) {
      throw new BadRequestException('Department not found');
    }

    return await this.positionRepository.update(id, {
      ...updatePositionDto,
      department,
    });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.positionRepository.delete(id);
  }
}
