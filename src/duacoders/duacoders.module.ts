import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuacodersService } from './duacoders.service';
import { DuacodersController } from './duacoders.controller';
import { Duacoder } from './entities/duacoder.entity';

import { DepartmentsModule } from 'src/departments/departments.module';
import { DepartmentsService } from 'src/departments/departments.service';

import { PositionsModule } from 'src/positions/positions.module';
import { PositionsService } from 'src/positions/positions.service';

import { SkillsModule } from 'src/skills/skills.module';
import { SkillsService } from 'src/skills/skills.service';

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
})
export class DuacodersModule {}
