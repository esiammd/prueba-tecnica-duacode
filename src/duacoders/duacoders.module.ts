import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuacodersService } from './duacoders.service';
import { DuacodersController } from './duacoders.controller';
import { Duacoder } from './entities/duacoder.entity';

import { DepartmentsModule } from '../departments/departments.module';
import { DepartmentsService } from '../departments/departments.service';

import { PositionsModule } from '../positions/positions.module';
import { PositionsService } from '../positions/positions.service';

import { SkillsModule } from '../skills/skills.module';
import { SkillsService } from '../skills/skills.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Duacoder]),
    DepartmentsModule,
    PositionsModule,
    SkillsModule,
  ],
  controllers: [DuacodersController],
  providers: [
    DuacodersService,
    DepartmentsService,
    PositionsService,
    SkillsService,
  ],
  exports: [DuacodersService],
})
export class DuacodersModule {}
