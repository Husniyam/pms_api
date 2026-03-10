// src/tashkilotlar/entities/tashkilot.entity.ts
import { TamirJadval } from 'src/modules/tamir-jadvali/entities/tamir-jadvali.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('tashkilotlar')
export class Tashkilot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  nomi: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  kod: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefon: string;

  @Column({ type: 'text', nullable: true })
  manzil: string;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @OneToMany(() => TamirJadval, jadval => jadval.tashkilot)
  tamirJadvallari: TamirJadval[];
}