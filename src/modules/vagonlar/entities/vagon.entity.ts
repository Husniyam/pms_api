// src/vagonlar/entities/vagon.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { VagonTuri } from '../../vagon-turlari/entities/vagon-turi.entity';
import { TamirJadval } from '../../tamir-jadvali/entities/tamir-jadvali.entity';

export enum VagonHolati {
  ACTIVE = 'active',
  REPAIR = 'repair',
  BROKEN = 'broken',
  DECOMMISSIONED = 'decommissioned'
}

@Entity('vagonlar')
export class Vagon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  raqami: string;

  @Column({ name: 'vagon_turi_id' })
  vagonTuriId: number;

  @Column({ type: 'date', name: 'ishlab_chigarilgan_sana' })
  ishlabChigarilganSana: Date;

  @Column({ type: 'int', name: 'bosib_otgan_km', default: 0 })
  bosibOtganKm: number;

  @Column({ 
    type: 'enum', 
    enum: VagonHolati,
    default: VagonHolati.ACTIVE
  })
  holati: VagonHolati;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @ManyToOne(() => VagonTuri, vagonTuri => vagonTuri.vagonlar)
  @JoinColumn({ name: 'vagon_turi_id' })
  vagonTuri: VagonTuri;

  @OneToMany(() => TamirJadval, jadval => jadval.vagon)
  tamirJadvallari: TamirJadval[];
}