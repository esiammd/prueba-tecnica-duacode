import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Position } from '../../positions/entities/position.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Duacoder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nif: string;

  @Column()
  name: string;

  @Column()
  biography: string;

  @Column({ name: 'department_id' })
  departmentId: string;

  @ManyToOne(() => Department, department => department.id, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'position_id' })
  positionId: string;

  @ManyToOne(() => Position, position => position.id, { eager: true })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @ManyToMany(() => Skill, skill => skill.duacoders, { eager: true })
  @JoinTable({
    name: 'duacoder_skill',
    joinColumn: { name: 'duacoder_id' },
    inverseJoinColumn: { name: 'skill_id' },
  })
  skills: Skill[];

  @Column()
  photo: string;

  @Column({ name: 'tortilla_with_onion' })
  tortillaWithOnion: boolean;

  @ApiPropertyOptional({ example: 'yyyy-mm-dd' })
  @Column({ name: 'date_of_birth', nullable: true, type: 'date' })
  dateOfBirth?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
