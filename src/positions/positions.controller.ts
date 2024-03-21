import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
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

import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { DuacoderRole } from '../common/enums/duacoder-role.enum';

@ApiTags('positions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
@ApiForbiddenResponse({ description: 'Forbidden access.' })
@Auth(DuacoderRole.ADMIN)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Position created successfully.',
    type: Position,
  })
  @ApiBadRequestResponse({ description: 'Bad Request Response API.' })
  @ApiConflictResponse({ description: 'Position already exists.' })
  async create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    return await this.positionsService.create(createPositionDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List all positions.',
    type: Position,
    isArray: true,
  })
  async findAll(): Promise<Position[]> {
    return await this.positionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Displays the requested position.',
    type: Position,
  })
  async findOne(@Param('id') id: string): Promise<Position> {
    return await this.positionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Position updated successfully.',
    type: Position,
  })
  @ApiConflictResponse({ description: 'Position already exists.' })
  @ApiNotFoundResponse({ description: 'Position not found.' })
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    return await this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Position successfully removed.' })
  @ApiNotFoundResponse({ description: 'Position not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.positionsService.remove(id);
  }
}
