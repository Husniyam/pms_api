// src/tamir-turlari/entities/tamir-turi.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { VagonTamirMuddati } from '../../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';
import { TamirJadval } from '../../tamir-jadvali/entities/tamir-jadvali.entity';

@Entity('tamir_turlari')
export class TamirTuri {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nomi: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  kodi: string;

  @Column({ type: 'text', nullable: true })
  tavsifi: string;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @OneToMany(() => VagonTamirMuddati, muddat => muddat.tamirTuri)
  tamirMuddatlari: VagonTamirMuddati[];

  @OneToMany(() => TamirJadval, jadval => jadval.tamirTuri)
  tamirJadvallari: TamirJadval[];
}