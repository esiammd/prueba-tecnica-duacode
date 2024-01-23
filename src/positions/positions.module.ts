import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { Position } from './entities/position.entity';

import { DepartmentsModule } from 'src/departments/departments.module';
import { DepartmentsService } from 'src/departments/departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position]), DepartmentsModule],
  controllers: [PositionsController],
  providers: [PositionsService, DepartmentsService],
})
export class PositionsModule {}
