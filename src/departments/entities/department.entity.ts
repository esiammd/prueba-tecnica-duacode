import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Duacoder } from 'src/duacoders/entities/duacoder.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Duacoder, duacoder => duacoder.department, { cascade: true })
  duacoders: Duacoder[];
}
