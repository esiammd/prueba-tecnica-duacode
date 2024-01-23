import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { type DeleteResult, type UpdateResult } from 'typeorm';

import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { type Position } from './entities/position.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    return await this.positionsService.create(createPositionDto);
  }

  @Get()
  async findAll(): Promise<Position[]> {
    return await this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Position> {
    return await this.positionsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<UpdateResult> {
    return await this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.positionsService.remove(id);
  }
}
