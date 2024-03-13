import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { SkillsModule } from './skills/skills.module';
import { DuacodersModule } from './duacoders/duacoders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    DepartmentsModule,
    PositionsModule,
    SkillsModule,
    DuacodersModule,
    AuthModule,
  ],
})
export class AppModule {}
