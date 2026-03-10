import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VagonTamirMuddati } from './entities/vagon-tamir-muddati.entity';
import { VagonTamirMuddatlariController } from './vagon-tamir-muddatlari.controller';
import { VagonTamirMuddatlariService } from './vagon-tamir-muddatlari.service';
import { VagonTuri } from '../vagon-turlari/entities/vagon-turi.entity';
import { TamirJadval } from '../tamir-jadvali/entities/tamir-jadvali.entity';
import { TamirTuri } from '../tamir-turlari/entities/tamir-turi.entity';
import { Vagon } from '../vagonlar/entities/vagon.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VagonTamirMuddati, VagonTuri, TamirJadval, TamirTuri, Vagon])],
    controllers: [VagonTamirMuddatlariController],
    providers: [VagonTamirMuddatlariService],
    exports: [VagonTamirMuddatlariService, TypeOrmModule],
})
export class VagonTamirMuddatlariModule {}
