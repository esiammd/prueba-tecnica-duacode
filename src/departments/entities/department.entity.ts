import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Duacoder } from '../../duacoders/entities/duacoder.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ApiHideProperty()
  @OneToMany(() => Duacoder, duacoder => duacoder.department, { cascade: true })
  duacoders: Duacoder[];
}
