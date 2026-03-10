// src/tamir-jadvali/entities/tamir-jadvali.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vagon } from '../../vagonlar/entities/vagon.entity';
import { TamirTuri } from '../../tamir-turlari/entities/tamir-turi.entity';
import { VagonTamirMuddati } from '../../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';
import { Tashkilot } from '../../tashkilotlar/entities/tashkilot.entity';
import { User } from 'src/users/entities/user.entity';;

export enum TamirHolati {
  REJALASHTIRILGAN = 'rejalashtirilgan',
  JARAYONDA = 'jarayonda',
  TUGALLANGAN = 'tugallangan',
  BEKOR_QILINGAN = 'bekor_qilingan'
}

@Entity('tamir_jadvali')
export class TamirJadval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vagon_id' })
  vagonId: number;

  @Column({ name: 'tamir_turi_id' })
  tamirTuriId: number;

  @Column({ name: 'vagon_tamir_muddati_id' })
  vagonTamirMuddatiId: number;

  @Column({ name: 'tashkilot_id' })
  tashkilotId: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'date', name: 'rejalashtirilgan_sana' })
  rejalashtirilganSana: Date;

  @Column({ type: 'date', name: 'amalga_oshirilgan_sana', nullable: true })
  amalgaOshirilganSana: Date;

  @Column({ 
    type: 'enum', 
    enum: TamirHolati,
    default: TamirHolati.REJALASHTIRILGAN
  })
  holati: TamirHolati;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'tamir_qiymati', nullable: true })
  tamirQiymati: number;

  @Column({ type: 'text', nullable: true })
  izoh: string;

  @CreateDateColumn({ name: 'yaratilgan_vaqt' })
  yaratilganVaqt: Date;

  @ManyToOne(() => Vagon, vagon => vagon.tamirJadvallari)
  @JoinColumn({ name: 'vagon_id' })
  vagon: Vagon;

  @ManyToOne(() => TamirTuri, tamirTuri => tamirTuri.tamirJadvallari)
  @JoinColumn({ name: 'tamir_turi_id' })
  tamirTuri: TamirTuri;

  @ManyToOne(() => VagonTamirMuddati, muddat => muddat.tamirJadvallari)
  @JoinColumn({ name: 'vagon_tamir_muddati_id' })
  vagonTamirMuddati: VagonTamirMuddati;

  @ManyToOne(() => Tashkilot, tashkilot => tashkilot.tamirJadvallari)
  @JoinColumn({ name: 'tashkilot_id' })
  tashkilot: Tashkilot;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}