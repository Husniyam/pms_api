// src/vagonlar/vagonlar.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, LessThan, MoreThan } from 'typeorm';
import { Vagon, VagonHolati } from './entities/vagon.entity';
import { CreateVagonDto } from './dto/create-vagon.dto';
import { UpdateVagonDto } from './dto/update-vagon.dto';
import { VagonTuri } from '../vagon-turlari/entities/vagon-turi.entity';
import { VagonTamirMuddati } from '../vagon-tamir-muddatlari/entities/vagon-tamir-muddati.entity';

@Injectable()
export class VagonlarService {
  constructor(
    @InjectRepository(Vagon)
    private vagonRepository: Repository<Vagon>,
    
    @InjectRepository(VagonTuri)
    private vagonTuriRepository: Repository<VagonTuri>,
    
    @InjectRepository(VagonTamirMuddati)
    private vagonTamirMuddatiRepository: Repository<VagonTamirMuddati>,
  ) {}

  async create(createVagonDto: CreateVagonDto): Promise<Vagon> {
    // Check if vagon raqami exists
    const existing = await this.vagonRepository.findOne({
      where: { raqami: createVagonDto.raqami }
    });

    if (existing) {
      throw new ConflictException('Bunday vagon raqami allaqachon mavjud');
    }

    // Check if vagon turi exists
    const vagonTuri = await this.vagonTuriRepository.findOne({
      where: { id: createVagonDto.vagonTuriId }
    });

    if (!vagonTuri) {
      throw new NotFoundException('Vagon turi topilmadi');
    }

    const vagon = this.vagonRepository.create({
      ...createVagonDto,
      ishlabChigarilganSana: new Date(createVagonDto.ishlabChigarilganSana)
    });

    return await this.vagonRepository.save(vagon);
  }

  async findAll(query: any): Promise<{ items: Vagon[]; total: number }> {
    const { 
      vagonTuriId, 
      holati,
      search,
      fromDate,
      toDate,
      minKm,
      maxKm,
      page = 1, 
      limit = 10 
    } = query;
    
    const where: any = {};
    
    if (vagonTuriId) where.vagonTuriId = vagonTuriId;
    if (holati) where.holati = holati;
    
    if (search) {
      where.raqami = Like(`%${search}%`);
    }

    if (fromDate && toDate) {
      where.ishlabChigarilganSana = Between(new Date(fromDate), new Date(toDate));
    }

    if (minKm && maxKm) {
      where.bosibOtganKm = Between(minKm, maxKm);
    } else if (minKm) {
      where.bosibOtganKm = MoreThan(minKm);
    } else if (maxKm) {
      where.bosibOtganKm = LessThan(maxKm);
    }

    const [items, total] = await this.vagonRepository.findAndCount({
      where,
      relations: ['vagonTuri', 'tamirJadvallari'],
      skip: (page - 1) * limit,
      take: limit,
      order: { yaratilganVaqt: 'DESC' },
    });

    return { items, total };
  }

  async getDropdown(): Promise<{ id: number; raqami: string; holati: string }[]> {
    const items = await this.vagonRepository.find({
      select: ['id', 'raqami', 'holati'],
      where: { holati: VagonHolati.ACTIVE },
      order: { raqami: 'ASC' }
    });
    return items;
  }

  async findByHolat(holati: string): Promise<Vagon[]> {
    if (!Object.values(VagonHolati).includes(holati as VagonHolati)) {
      throw new BadRequestException('Noto\'g\'ri vagon holati');
    }

    return this.vagonRepository.find({
      where: { holati: holati as VagonHolati },
      relations: ['vagonTuri'],
      order: { raqami: 'ASC' }
    });
  }

  async findByVagonTuri(vagonTuriId: number): Promise<Vagon[]> {
    return this.vagonRepository.find({
      where: { vagonTuriId },
      relations: ['vagonTuri'],
      order: { raqami: 'ASC' }
    });
  }

  async getRepairNeeded(): Promise<Vagon[]> {
    const vagonlar = await this.vagonRepository.find({
      relations: ['vagonTuri']
    });

    const repairNeeded: Vagon[] = [];

    for (const vagon of vagonlar) {
      const muddatlar = await this.vagonTamirMuddatiRepository.find({
        where: { vagonTuriId: vagon.vagonTuriId }
      });

      const ishlabChiqarilganSana = new Date(vagon.ishlabChigarilganSana);
      const hozir = new Date();
      const oylarFarqi = (hozir.getFullYear() - ishlabChiqarilganSana.getFullYear()) * 12 + 
                         (hozir.getMonth() - ishlabChiqarilganSana.getMonth());

      for (const muddat of muddatlar) {
        if (oylarFarqi >= muddat.muddatOy || vagon.bosibOtganKm >= muddat.maksimalKm) {
          repairNeeded.push(vagon);
          break;
        }
      }
    }

    return repairNeeded;
  }

  async getStatistics(): Promise<any> {
    const total = await this.vagonRepository.count();
    
    const active = await this.vagonRepository.count({ 
      where: { holati: VagonHolati.ACTIVE } 
    });
    
    const repair = await this.vagonRepository.count({ 
      where: { holati: VagonHolati.REPAIR } 
    });
    
    const broken = await this.vagonRepository.count({ 
      where: { holati: VagonHolati.BROKEN } 
    });
    
    const decommissioned = await this.vagonRepository.count({ 
      where: { holati: VagonHolati.DECOMMISSIONED } 
    });

    const totalKm = await this.vagonRepository
      .createQueryBuilder('vagon')
      .select('SUM(vagon.bosibOtganKm)', 'total')
      .getRawOne();

    const averageKm = await this.vagonRepository
      .createQueryBuilder('vagon')
      .select('AVG(vagon.bosibOtganKm)', 'average')
      .where('vagon.holati != :holati', { holati: VagonHolati.DECOMMISSIONED })
      .getRawOne();

    // Vagon turlari bo'yicha statistika
    const turStat = await this.vagonRepository
      .createQueryBuilder('vagon')
      .leftJoin('vagon.vagonTuri', 'turi')
      .select('turi.nomi', 'turi')
      .addSelect('COUNT(vagon.id)', 'soni')
      .groupBy('turi.nomi')
      .getRawMany();

    return {
      total,
      active,
      repair,
      broken,
      decommissioned,
      totalKm: totalKm?.total || 0,
      averageKm: Math.round(averageKm?.average || 0),
      turStat
    };
  }

  async checkKmLimits(): Promise<any[]> {
    const vagonlar = await this.vagonRepository.find({
      relations: ['vagonTuri']
    });

    const results = [] as any[];

    for (const vagon of vagonlar) {
      const muddatlar = await this.vagonTamirMuddatiRepository.find({
        where: { vagonTuriId: vagon.vagonTuriId }
      });

      for (const muddat of muddatlar) {
        if (vagon.bosibOtganKm >= muddat.maksimalKm * 0.9) { // 90% dan oshgan
          results.push({
            vagonRaqami: vagon.raqami,
            vagonTuri: vagon.vagonTuri.nomi,
            hozirgiKm: vagon.bosibOtganKm,
            limitKm: muddat.maksimalKm,
            foiz: Math.round((vagon.bosibOtganKm / muddat.maksimalKm) * 100),
            tamirTuri: muddat.tamirTuri?.nomi || 'Noma\'lum'
          });
        }
      }
    }

    return results.sort((a, b) => b.foiz - a.foiz);
  }

  async findOne(id: number): Promise<Vagon> {
    const item = await this.vagonRepository.findOne({ 
      where: { id },
      relations: ['vagonTuri', 'tamirJadvallari', 'tamirJadvallari.tamirTuri']
    });
    
    if (!item) {
      throw new NotFoundException('Vagon topilmadi');
    }

    return item;
  }

  async findByRaqam(raqami: string): Promise<Vagon> {
    const item = await this.vagonRepository.findOne({ 
      where: { raqami },
      relations: ['vagonTuri', 'tamirJadvallari']
    });
    
    if (!item) {
      throw new NotFoundException('Vagon topilmadi');
    }

    return item;
  }

  async update(id: number, updateVagonDto: UpdateVagonDto): Promise<Vagon> {
    const item = await this.findOne(id);

    // Check if raqami exists for other items
    if (updateVagonDto.raqami) {
      const existing = await this.vagonRepository.findOne({
        where: { raqami: updateVagonDto.raqami }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Bunday vagon raqami allaqachon mavjud');
      }
    }

    if (updateVagonDto.ishlabChigarilganSana) {
      updateVagonDto.ishlabChigarilganSana = new Date(updateVagonDto.ishlabChigarilganSana);
    }

    await this.vagonRepository.update(id, updateVagonDto);
    return this.findOne(id);
  }

  async updateHolat(id: number, holati: string): Promise<Vagon> {
    const item = await this.findOne(id);
    
    if (!Object.values(VagonHolati).includes(holati as VagonHolati)) {
      throw new BadRequestException('Noto\'g\'ri vagon holati');
    }

    item.holati = holati as VagonHolati;
    await this.vagonRepository.save(item);
    return item;
  }

  async updateKm(id: number, km: number): Promise<Vagon> {
    const item = await this.findOne(id);
    
    if (km < 0) {
      throw new BadRequestException('KM manfiy bo\'lishi mumkin emas');
    }

    if (km < item.bosibOtganKm) {
      throw new BadRequestException('Yangi KM eski KM dan kichik bo\'lishi mumkin emas');
    }

    item.bosibOtganKm = km;
    await this.vagonRepository.save(item);
    return item;
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    
    // Check if it has related tamir jadvallari
    if (item.tamirJadvallari?.length > 0) {
      throw new ConflictException('Bu vagonga bog\'langan tamir jadvallari mavjud');
    }

    await this.vagonRepository.remove(item);
  }
}