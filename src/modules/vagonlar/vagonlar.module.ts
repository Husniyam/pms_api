import { Module } from '@nestjs/common';
import { VagonlarService } from './vagonlar.service';
import { Vagon } from './entities/vagon.entity';
import { VagonlarController } from './vagonlar.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { VagonTuri } from '../vagon-turlari/entities/vagon-turi.entity';
import { TamirJadval } from '../tamir-jadvali/entities/tamir-jadvali.entity';
import { VagonTamirMuddati } from '../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vagon, VagonTuri, TamirJadval, VagonTamirMuddati])],
    controllers: [VagonlarController],
    providers: [VagonlarService],
    exports: [VagonlarService, TypeOrmModule],
})
export class VagonlarModule {}
