// src/vagon-tamir-muddatlari/vagon-tamir-muddatlari.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VagonTamirMuddati } from './entities/vagon-tamir-muddati.entity';
import { CreateVagonTamirMuddatiDto } from './dto/create-vagon-tamir-muddati.dto';
import { UpdateVagonTamirMuddatiDto } from './dto/update-vagon-tamir-muddati.dto';
import { VagonTuri } from '../vagon-turlari/entities/vagon-turi.entity';
import { TamirTuri } from '../tamir-turlari/entities/tamir-turi.entity';
import { Vagon } from '../vagonlar/entities/vagon.entity';

@Injectable()
export class VagonTamirMuddatlariService {
  constructor(
    @InjectRepository(VagonTamirMuddati)
    private vagonTamirMuddatiRepository: Repository<VagonTamirMuddati>,
    
    @InjectRepository(VagonTuri)
    private vagonTuriRepository: Repository<VagonTuri>,
    
    @InjectRepository(TamirTuri)
    private tamirTuriRepository: Repository<TamirTuri>,
    
    @InjectRepository(Vagon)
    private vagonRepository: Repository<Vagon>,
  ) {}

  async create(createDto: CreateVagonTamirMuddatiDto): Promise<VagonTamirMuddati> {
    // Check if vagon turi exists
    const vagonTuri = await this.vagonTuriRepository.findOne({ 
      where: { id: createDto.vagonTuriId } 
    });
    
    if (!vagonTuri) {
      throw new NotFoundException('Vagon turi topilmadi');
    }

    // Check if tamir turi exists
    const tamirTuri = await this.tamirTuriRepository.findOne({ 
      where: { id: createDto.tamirTuriId } 
    });
    
    if (!tamirTuri) {
      throw new NotFoundException('Tamir turi topilmadi');
    }

    // Check for duplicate
    const existing = await this.vagonTamirMuddatiRepository.findOne({
      where: {
        vagonTuriId: createDto.vagonTuriId,
        tamirTuriId: createDto.tamirTuriId
      }
    });

    if (existing) {
      throw new ConflictException('Bu vagon turi va tamir turi uchun muddat allaqachon mavjud');
    }

    const item = this.vagonTamirMuddatiRepository.create(createDto);
    return await this.vagonTamirMuddatiRepository.save(item);
  }

  async findAll(query: any): Promise<{ items: VagonTamirMuddati[]; total: number }> {
    const { vagonTuriId, tamirTuriId, page = 1, limit = 10 } = query;
    
    const where: any = {};
    
    if (vagonTuriId) where.vagonTuriId = vagonTuriId;
    if (tamirTuriId) where.tamirTuriId = tamirTuriId;

    const [items, total] = await this.vagonTamirMuddatiRepository.findAndCount({
      where,
      relations: ['vagonTuri', 'tamirTuri'],
      skip: (page - 1) * limit,
      take: limit,
      order: { yaratilganVaqt: 'DESC' },
    });

    return { items, total };
  }

  async findByVagonTuri(vagonTuriId: number): Promise<VagonTamirMuddati[]> {
    return this.vagonTamirMuddatiRepository.find({
      where: { vagonTuriId },
      relations: ['tamirTuri'],
      order: { muddatOy: 'ASC' }
    });
  }

  async findByTamirTuri(tamirTuriId: number): Promise<VagonTamirMuddati[]> {
    return this.vagonTamirMuddatiRepository.find({
      where: { tamirTuriId },
      relations: ['vagonTuri'],
      order: { muddatOy: 'ASC' }
    });
  }

  async findOne(id: number): Promise<VagonTamirMuddati> {
    const item = await this.vagonTamirMuddatiRepository.findOne({ 
      where: { id },
      relations: ['vagonTuri', 'tamirTuri', 'tamirJadvallari']
    });
    
    if (!item) {
      throw new NotFoundException('Vagon tamir muddati topilmadi');
    }

    return item;
  }

  async checkVagonMuddat(vagonId: number): Promise<any> {
    const vagon = await this.vagonRepository.findOne({ 
      where: { id: vagonId },
      relations: ['vagonTuri']
    });
    
    if (!vagon) {
      throw new NotFoundException('Vagon topilmadi');
    }

    const muddatlar = await this.vagonTamirMuddatiRepository.find({
      where: { vagonTuriId: vagon.vagonTuriId },
      relations: ['tamirTuri']
    });

    const ishlabChiqarilganSana = new Date(vagon.ishlabChigarilganSana);
    const hozir = new Date();
    const oylarFarqi = (hozir.getFullYear() - ishlabChiqarilganSana.getFullYear()) * 12 + 
                       (hozir.getMonth() - ishlabChiqarilganSana.getMonth());

    const natijalar = muddatlar.map(muddat => {
      const muddatOtganOy = oylarFarqi >= muddat.muddatOy;
      const kmSharti = vagon.bosibOtganKm >= muddat.maksimalKm;

      return {
        tamirTuri: muddat.tamirTuri.nomi,
        muddatOy: muddat.muddatOy,
        maksimalKm: muddat.maksimalKm,
        hozirgiOy: oylarFarqi,
        hozirgiKm: vagon.bosibOtganKm,
        muddatOtgan: muddatOtganOy || kmSharti,
        sabab: muddatOtganOy ? 'muddat' : kmSharti ? 'km' : 'yo\'q'
      };
    });

    const muddatiOtganlar = natijalar.filter(n => n.muddatOtgan);

    return {
      vagonRaqami: vagon.raqami,
      vagonTuri: vagon.vagonTuri.nomi,
      ishlabChiqarilganSana: vagon.ishlabChigarilganSana,
      bosibOtganKm: vagon.bosibOtganKm,
      umumiyOy: oylarFarqi,
      muddatiOtganlar,
      tekshirishVaqti: new Date()
    };
  }

  async update(id: number, updateDto: UpdateVagonTamirMuddatiDto): Promise<VagonTamirMuddati> {
    const item = await this.findOne(id);

    // Check for duplicates if vagonTuriId or tamirTuriId changed
    if (updateDto.vagonTuriId || updateDto.tamirTuriId) {
      const existing = await this.vagonTamirMuddatiRepository.findOne({
        where: {
          vagonTuriId: updateDto.vagonTuriId || item.vagonTuriId,
          tamirTuriId: updateDto.tamirTuriId || item.tamirTuriId
        }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Bu vagon turi va tamir turi uchun muddat allaqachon mavjud');
      }
    }

    await this.vagonTamirMuddatiRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    
    // Check if it has related tamir jadvallari
    if (item.tamirJadvallari?.length > 0) {
      throw new ConflictException('Bu muddatga bog\'langan tamir jadvallari mavjud');
    }

    await this.vagonTamirMuddatiRepository.remove(item);
  }
}