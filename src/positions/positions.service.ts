import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, type ObjectLiteral, Repository } from 'typeorm';

import { type CreatePositionDto } from './dto/create-position.dto';
import { type UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { type PositionFilterDto } from './dto/position-filter.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    await this.validatePosition(createPositionDto.name);

    const position = this.positionRepository.create(createPositionDto);
    return await this.positionRepository.save(position);
  }

  async findAll({
    limit,
    offset,
    ...filters
  }: PositionFilterDto): Promise<Position[]> {
    const { name } = filters;
    const whereObj: ObjectLiteral = {};

    if (name) {
      whereObj.name = Like(`%${name}%`);
    }

    return await this.positionRepository
      .createQueryBuilder('position')
      .where(whereObj)
      .orderBy('position.name', 'ASC')
      .offset(offset)
      .limit(limit)
      .getMany();
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

    await this.comparePosition(updatePositionDto.name, position.name);

    await this.positionRepository.update(id, updatePositionDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.positionRepository.delete(id);
  }

  private async validatePosition(name: string): Promise<void> {
    const positionExist = await this.positionRepository.findOneBy({ name });

    if (positionExist) {
      throw new ConflictException('Position already exists');
    }
  }

  private async comparePosition(
    newPosition: string,
    oldPosition: string,
  ): Promise<void> {
    if (newPosition && newPosition !== oldPosition) {
      const positionExists = await this.positionRepository.findOneBy({
        name: newPosition,
      });

      if (positionExists) {
        throw new ConflictException('Position belongs to another duacode');
      }
    }
  }
}
