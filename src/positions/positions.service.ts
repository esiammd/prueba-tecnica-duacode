import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type CreatePositionDto } from './dto/create-position.dto';
import { type UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const positionExist = await this.positionRepository.findOneBy({
      name: createPositionDto.name,
    });

    if (positionExist) {
      throw new ConflictException('Position already exists');
    }

    const position = this.positionRepository.create(createPositionDto);
    return await this.positionRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return await this.positionRepository.find();
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepository.findOneBy({ id });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    return position;
  }

  async update(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findOne(id);

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    await this.positionRepository.update(id, updatePositionDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const position = await this.findOne(id);

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    await this.positionRepository.delete(id);
  }
}
