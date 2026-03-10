// src/vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { VagonTuri } from '../../vagon-turlari/entities/vagon-turi.entity';
import { TamirTuri } from '../../tamir-turlari/entities/tamir-turi.entity';
import { TamirJadval } from 'src/modules/tamir-jadvali/entities/tamir-jadvali.entity';
// import { TamirJadval } from '../../tamir-jadvali/entities/tamir-jadvali.entity';

@Entity('vagon_tamir_muddatlari')
export class VagonTamirMuddati {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vagon_turi_id' })
  vagonTuriId: number;

  @Column({ name: 'tamir_turi_id' })
  tamirTuriId: number;

  @Column({ type: 'int', name: 'muddat_oy' })
  muddatOy: number;

  @Column({ type: 'int', name: 'maksimal_km' })
  maksimalKm: number;

  @Column({ type: 'text', nullable: true })
  izoh: string;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @ManyToOne(() => VagonTuri, vagonTuri => vagonTuri.tamirMuddatlari)
  @JoinColumn({ name: 'vagon_turi_id' })
  vagonTuri: VagonTuri;

  @ManyToOne(() => TamirTuri, tamirTuri => tamirTuri.tamirMuddatlari)
  @JoinColumn({ name: 'tamir_turi_id' })
  tamirTuri: TamirTuri;

  @OneToMany(() => TamirJadval, jadval => jadval.vagonTamirMuddati)
  tamirJadvallari: TamirJadval[];
}