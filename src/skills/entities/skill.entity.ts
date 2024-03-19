import { ApiHideProperty } from '@nestjs/swagger';
import { Duacoder } from '../../duacoders/entities/duacoder.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ApiHideProperty()
  @ManyToMany(() => Duacoder, duacoder => duacoder.skills, { cascade: true })
  duacoders: Duacoder[];
}
