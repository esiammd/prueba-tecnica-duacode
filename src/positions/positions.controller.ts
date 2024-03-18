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

import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { type Position } from './entities/position.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @Auth(UserRole.ADMIN)
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
  ): Promise<Position> {
    return await this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.positionsService.remove(id);
  }
}
