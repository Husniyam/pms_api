// src/vagon-turlari/vagon-turlari.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VagonTuri } from './entities/vagon-turi.entity';
import { VagonTurlariService } from './vagon-turlari.service';
import { VagonTurlariController } from './vagon-turlari.controller';
import { VagonTamirMuddati } from '../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';
import { Vagon } from '../vagonlar/entities/vagon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VagonTuri, VagonTamirMuddati, Vagon])],
  controllers: [VagonTurlariController],
  providers: [VagonTurlariService],
  exports: [VagonTurlariService, TypeOrmModule],
})
export class VagonTurlariModule {}