import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DuacodersService } from './duacoders.service';
import { CreateDuacoderDto } from './dto/create-duacoder.dto';
import { UpdateDuacoderDto } from './dto/update-duacoder.dto';
import { Duacoder } from './entities/duacoder.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { DuacoderRole } from '../common/enums/duacoder-role.enum';

@ApiTags('duacoders')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
@ApiForbiddenResponse({ description: 'Forbidden access.' })
@Auth(DuacoderRole.USER)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('duacoders')
export class DuacodersController {
  constructor(private readonly duacodersService: DuacodersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Duacoder created successfully.',
    type: Duacoder,
  })
  @ApiBadRequestResponse({ description: 'Bad Request Response API.' })
  @ApiConflictResponse({ description: 'NIF or Email already registered.' })
  async create(
    @Body() createDuacoderDto: CreateDuacoderDto,
  ): Promise<Duacoder> {
    return await this.duacodersService.create(createDuacoderDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List all duacoders.',
    type: Duacoder,
    isArray: true,
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<Duacoder[]> {
    return await this.duacodersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Displays the requested duacoder.',
    type: Duacoder,
  })
  async findOne(@Param('id') id: string): Promise<Duacoder> {
    return await this.duacodersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Duacoder updated successfully.',
    type: Duacoder,
  })
  @ApiNotFoundResponse({ description: 'Duacoder not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDuacoderDto: UpdateDuacoderDto,
  ): Promise<Duacoder> {
    return await this.duacodersService.update(id, updateDuacoderDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Duacoder successfully removed.' })
  @ApiNotFoundResponse({ description: 'Duacoder not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.duacodersService.remove(id);
  }
}
