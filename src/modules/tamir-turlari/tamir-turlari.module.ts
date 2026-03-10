import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamirTuri } from './entities/tamir-turi.entity';
import { TamirTurlariController } from './tamir-turlari.controller';
import { TamirTurlariService } from './tamir-turlari.service';
import { TamirJadval } from '../tamir-jadvali/entities/tamir-jadvali.entity';
import { VagonTamirMuddati } from '../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TamirTuri, TamirJadval, VagonTamirMuddati])],
    controllers: [TamirTurlariController],
    providers: [TamirTurlariService],
    exports: [TamirTurlariService, TypeOrmModule],
})
export class TamirTurlariModule {}
