import { Injectable } from '@nestjs/common';
import { type CreatePositionDto } from './dto/create-position.dto';
import { type UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { type DeleteResult, Repository, type UpdateResult } from 'typeorm';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const positions = this.positionRepository.create(createPositionDto);
    return await this.positionRepository.save(positions);
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
    return await this.positionRepository.update(id, updatePositionDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.positionRepository.delete(id);
  }
}
