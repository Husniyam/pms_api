import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamirJadval } from './entities/tamir-jadvali.entity';
import { TamirJadvaliController } from './tamir-jadvali.controller';
import { TamirJadvaliService } from './tamir-jadvali.service';
import { Tashkilot } from '../tashkilotlar/entities/tashkilot.entity';
import { VagonTamirMuddati } from '../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';
import { TamirTuri } from '../tamir-turlari/entities/tamir-turi.entity';
import { User } from 'src/users/entities/user.entity';
import { Vagon } from '../vagonlar/entities/vagon.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TamirJadval, User, TamirTuri, VagonTamirMuddati, Tashkilot, Vagon])],
    controllers: [TamirJadvaliController],
    providers: [TamirJadvaliService],
    exports: [TamirJadvaliService, TypeOrmModule],
})
export class TamirJadvaliModule {}
