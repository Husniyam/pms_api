// src/vagon-turlari/entities/vagon-turi.entity.ts
import { VagonTamirMuddati } from 'src/modules/vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';
import { Vagon } from 'src/modules/vagonlar/entities/vagon.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity('vagon_turlari')
export class VagonTuri {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nomi: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'kodli' })
  kodli: string;

  @Column({ type: 'text', nullable: true })
  tavsifi: string;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @OneToMany(() => Vagon, vagon => vagon.vagonTuri)
  vagonlar: Vagon[];

  @OneToMany(() => VagonTamirMuddati, muddat => muddat.vagonTuri)
  tamirMuddatlari: VagonTamirMuddati[];
}