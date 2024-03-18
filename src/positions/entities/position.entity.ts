import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Duacoder } from '../../duacoders/entities/duacoder.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Duacoder, duacoder => duacoder.position, { cascade: true })
  duacoders: Duacoder[];
}
