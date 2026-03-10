// src/roles/entities/role.entity.ts
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
// import { User } from '../../users/entities/user.entity';

@Entity('rollar')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nomi: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  kod: string;

  @Column({ type: 'text', nullable: true })
  tavsifi: string;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @OneToMany(() => User, user => user.role)
  userlar: User[];
}