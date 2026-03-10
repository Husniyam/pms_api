// src/tamir-jadvali/tamir-jadvali.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan, Like, Not } from 'typeorm';
import { TamirJadval, TamirHolati } from './entities/tamir-jadvali.entity';
import { CreateTamirJadvaliDto, CreateTamirJadvaliwithUserDto } from './dto/create-tamir-jadvali.dto';
import { UpdateTamirJadvaliDto } from './dto/update-tamir-jadvali.dto';
import { Vagon } from '../vagonlar/entities/vagon.entity';
import { TamirTuri } from '../tamir-turlari/entities/tamir-turi.entity';
import { VagonTamirMuddati } from '../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';
import { Tashkilot } from '../tashkilotlar/entities/tashkilot.entity';

@Injectable()
export class TamirJadvaliService {
  constructor(
    @InjectRepository(TamirJadval)
    private tamirJadvalRepository: Repository<TamirJadval>,
    
    @InjectRepository(Vagon)
    private vagonRepository: Repository<Vagon>,
    
    @InjectRepository(TamirTuri)
    private tamirTuriRepository: Repository<TamirTuri>,
    
    @InjectRepository(VagonTamirMuddati)
    private vagonTamirMuddatiRepository: Repository<VagonTamirMuddati>,
    
    @InjectRepository(Tashkilot)
    private tashkilotRepository: Repository<Tashkilot>,
  ) {}

  async create(createTamirJadvaliDto: CreateTamirJadvaliwithUserDto): Promise<TamirJadval> {
    console.log(createTamirJadvaliDto);
    
    // Check if vagon exists
    const vagon = await this.vagonRepository.findOne({ 
      where: { id: createTamirJadvaliDto.vagonId } 
    });
    
    if (!vagon) {
      throw new NotFoundException('Vagon topilmadi');
    }

    // Check if tamir turi exists
    const tamirTuri = await this.tamirTuriRepository.findOne({ 
      where: { id: createTamirJadvaliDto.tamirTuriId } 
    });
    
    if (!tamirTuri) {
      throw new NotFoundException('Tamir turi topilmadi');
    }

    // Check if vagon tamir muddati exists
    const vagonTamirMuddati = await this.vagonTamirMuddatiRepository.findOne({ 
      where: { id: createTamirJadvaliDto.vagonTamirMuddatiId } 
    });
    
    if (!vagonTamirMuddati) {
      throw new NotFoundException('Vagon tamir muddati topilmadi');
    }

    // Check if tashkilot exists
    const tashkilot = await this.tashkilotRepository.findOne({ 
      where: { id: createTamirJadvaliDto.tashkilotId } 
    });
    
    if (!tashkilot) {
      throw new NotFoundException('Tashkilot topilmadi');
    }

    // Check for duplicate schedule
    const existingSchedule = await this.tamirJadvalRepository.findOne({
      where: {
        vagonId: createTamirJadvaliDto.vagonId,
        rejalashtirilganSana: new Date(createTamirJadvaliDto.rejalashtirilganSana),
        tamirTuriId: createTamirJadvaliDto.tamirTuriId
      }
    });

    if (existingSchedule) {
      throw new ConflictException('Bu vagonga bu sanada allaqachon tamir rejalashtirilgan');
    }

    const tamirJadval = this.tamirJadvalRepository.create({
      ...createTamirJadvaliDto,
      rejalashtirilganSana: new Date(createTamirJadvaliDto.rejalashtirilganSana),
      amalgaOshirilganSana: createTamirJadvaliDto.amalgaOshirilganSana 
        ? new Date(createTamirJadvaliDto.amalgaOshirilganSana) 
        : undefined
    });

    return await this.tamirJadvalRepository.save(tamirJadval);
  }

  async findAll(query: any): Promise<{ items: TamirJadval[]; total: number }> {
    const { 
      vagonId, 
      tamirTuriId, 
      tashkilotId,
      holati,
      fromDate, 
      toDate,
      page = 1, 
      limit = 10 
    } = query;
    
    const where: any = {};
    
    if (vagonId) where.vagonId = vagonId;
    if (tamirTuriId) where.tamirTuriId = tamirTuriId;
    if (tashkilotId) where.tashkilotId = tashkilotId;
    if (holati) where.holati = holati;
    
    if (fromDate && toDate) {
      where.rejalashtirilganSana = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.rejalashtirilganSana = MoreThan(new Date(fromDate));
    } else if (toDate) {
      where.rejalashtirilganSana = LessThan(new Date(toDate));
    }

    const [items, total] = await this.tamirJadvalRepository.findAndCount({
      where,
      relations: ['vagon', 'tamirTuri', 'tashkilot', 'user', 'vagonTamirMuddati'],
      skip: (page - 1) * limit,
      take: limit,
      order: { rejalashtirilganSana: 'ASC' },
    });

    return { items, total };
  }

  async findByVagon(vagonId: number, query: any): Promise<{ items: TamirJadval[]; total: number }> {
    return this.findAll({ ...query, vagonId });
  }

  async findByTashkilot(tashkilotId: number, query: any): Promise<{ items: TamirJadval[]; total: number }> {
    return this.findAll({ ...query, tashkilotId });
  }

  async getTodaySchedule(): Promise<TamirJadval[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.tamirJadvalRepository.find({
      where: {
        rejalashtirilganSana: Between(today, tomorrow),
        holati: TamirHolati.REJALASHTIRILGAN
      },
      relations: ['vagon', 'tamirTuri', 'tashkilot']
    });
  }

  async getOverdueSchedule(): Promise<TamirJadval[]> {
    const today = new Date();

    return this.tamirJadvalRepository.find({
      where: {
        rejalashtirilganSana: LessThan(today),
        holati: TamirHolati.REJALASHTIRILGAN
      },
      relations: ['vagon', 'tamirTuri', 'tashkilot'],
      order: { rejalashtirilganSana: 'ASC' }
    });
  }

  async getStatistics(): Promise<any> {
    const total = await this.tamirJadvalRepository.count();
    const rejalashtirilgan = await this.tamirJadvalRepository.count({ 
      where: { holati: TamirHolati.REJALASHTIRILGAN } 
    });
    const jarayonda = await this.tamirJadvalRepository.count({ 
      where: { holati: TamirHolati.JARAYONDA } 
    });
    const tugallangan = await this.tamirJadvalRepository.count({ 
      where: { holati: TamirHolati.TUGALLANGAN } 
    });
    const bekorQilingan = await this.tamirJadvalRepository.count({ 
      where: { holati: TamirHolati.BEKOR_QILINGAN } 
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bugungi = await this.tamirJadvalRepository.count({
      where: {
        rejalashtirilganSana: MoreThan(today),
        holati: TamirHolati.REJALASHTIRILGAN
      }
    });

    const muddatiOtgan = await this.tamirJadvalRepository.count({
      where: {
        rejalashtirilganSana: LessThan(today),
        holati: TamirHolati.REJALASHTIRILGAN
      }
    });

    return {
      total,
      rejalashtirilgan,
      jarayonda,
      tugallangan,
      bekorQilingan,
      bugungi,
      muddatiOtgan
    };
  }

  async findOne(id: number): Promise<TamirJadval> {
    const item = await this.tamirJadvalRepository.findOne({ 
      where: { id },
      relations: ['vagon', 'tamirTuri', 'tashkilot', 'user', 'vagonTamirMuddati']
    });
    
    if (!item) {
      throw new NotFoundException('Tamir jadvali topilmadi');
    }

    return item;
  }

  async update(id: number, updateTamirJadvaliDto: UpdateTamirJadvaliDto): Promise<TamirJadval> {
    const item = await this.findOne(id);

    // Check for conflicts if date changed
    if (updateTamirJadvaliDto.rejalashtirilganSana) {
      const existingSchedule = await this.tamirJadvalRepository.findOne({
        where: {
          vagonId: item.vagonId,
          rejalashtirilganSana: new Date(updateTamirJadvaliDto.rejalashtirilganSana),
          tamirTuriId: updateTamirJadvaliDto.tamirTuriId || item.tamirTuriId,
          id: Not(id) // Exclude current record
        }
      });

      if (existingSchedule) {
        throw new ConflictException('Bu vagonga bu sanada allaqachon tamir rejalashtirilgan');
      }
    }

    if (updateTamirJadvaliDto.rejalashtirilganSana) {
      updateTamirJadvaliDto.rejalashtirilganSana = new Date(updateTamirJadvaliDto.rejalashtirilganSana);
    }

    if (updateTamirJadvaliDto.amalgaOshirilganSana) {
      updateTamirJadvaliDto.amalgaOshirilganSana = new Date(updateTamirJadvaliDto.amalgaOshirilganSana);
    }

    await this.tamirJadvalRepository.update(id, updateTamirJadvaliDto);
    return this.findOne(id);
  }

  async updateStatus(id: number, holati: string): Promise<TamirJadval> {
    const item = await this.findOne(id);
    
    if (!Object.values(TamirHolati).includes(holati as TamirHolati)) {
      throw new BadRequestException('Noto\'g\'ri tamir holati');
    }

    item.holati = holati as TamirHolati;
    
    if (holati === TamirHolati.TUGALLANGAN) {
      item.amalgaOshirilganSana = new Date();
    }

    await this.tamirJadvalRepository.save(item);
    return item;
  }

  async complete(id: number, tamirQiymati: number, izoh?: string): Promise<TamirJadval> {
    const item = await this.findOne(id);
    
    item.holati = TamirHolati.TUGALLANGAN;
    item.amalgaOshirilganSana = new Date();
    item.tamirQiymati = tamirQiymati;
    if (izoh) {
      item.izoh = izoh;
    }

    await this.tamirJadvalRepository.save(item);
    return item;
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    
    if (item.holati === TamirHolati.TUGALLANGAN) {
      throw new BadRequestException('Tugallangan tamirni o\'chirib bo\'lmaydi');
    }

    await this.tamirJadvalRepository.remove(item);
  }
}