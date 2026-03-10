import { Module } from '@nestjs/common';
import { Tashkilot } from './entities/tashkilot.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { TashkilotlarController } from './tashkilotlar.controller';
import { TashkilotlarService } from './tashkilotlar.service';
import { TamirJadval } from '../tamir-jadvali/entities/tamir-jadvali.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tashkilot, TamirJadval])],
    controllers: [TashkilotlarController],
    providers: [TashkilotlarService],
    exports: [TashkilotlarService, TypeOrmModule],
})
export class TashkilotlarModule {}
