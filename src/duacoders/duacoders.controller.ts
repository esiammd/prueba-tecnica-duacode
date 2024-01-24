import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DuacodersService } from './duacoders.service';
import { CreateDuacoderDto } from './dto/create-duacoder.dto';
import { UpdateDuacoderDto } from './dto/update-duacoder.dto';
import { type Duacoder } from './entities/duacoder.entity';

@ApiTags('duacoders')
@Controller('duacoders')
export class DuacodersController {
  constructor(private readonly duacodersService: DuacodersService) {}

  @Post()
  async create(
    @Body() createDuacoderDto: CreateDuacoderDto,
  ): Promise<Duacoder> {
    return await this.duacodersService.create(createDuacoderDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<Duacoder[]> {
    return await this.duacodersService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Duacoder> {
    return await this.duacodersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDuacoderDto: UpdateDuacoderDto,
  ): Promise<Duacoder> {
    return await this.duacodersService.update(id, updateDuacoderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.duacodersService.remove(id);
  }
}
