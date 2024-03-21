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
import { Exclude } from 'class-transformer';
import { DuacoderRole } from 'src/common/enums/duacoder-role.enum';

@Entity()
export class Duacoder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nif: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: DuacoderRole, default: DuacoderRole.USER })
  role: DuacoderRole;

  @Column({ nullable: true })
  biography?: string;

  @Column({ name: 'department_id', nullable: true })
  @Exclude()
  departmentId?: string;

  @ManyToOne(() => Department, department => department.id, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ name: 'position_id', nullable: true })
  @Exclude()
  positionId?: string;

  @ManyToOne(() => Position, position => position.id, { eager: true })
  @JoinColumn({ name: 'position_id' })
  position?: Position;

  @ManyToMany(() => Skill, skill => skill.duacoders, { eager: true })
  @JoinTable({
    name: 'duacoder_skill',
    joinColumn: { name: 'duacoder_id' },
    inverseJoinColumn: { name: 'skill_id' },
  })
  skills?: Skill[];

  @Column({ nullable: true })
  photo?: string;

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
