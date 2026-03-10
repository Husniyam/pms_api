// src/tamir-turlari/tamir-turlari.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { TamirTuri } from './entities/tamir-turi.entity';
import { CreateTamirTuriDto } from './dto/create-tamir-turi.dto';
import { UpdateTamirTuriDto } from './dto/update-tamir-turi.dto';

@Injectable()
export class TamirTurlariService {
  constructor(
    @InjectRepository(TamirTuri)
    private tamirTuriRepository: Repository<TamirTuri>,
  ) {}

  async create(createTamirTuriDto: CreateTamirTuriDto): Promise<TamirTuri> {
    // Check if code exists
    const existing = await this.tamirTuriRepository.findOne({
      where: { kodi: createTamirTuriDto.kodi }
    });

    if (existing) {
      throw new ConflictException('Bunday tamir turi kodi allaqachon mavjud');
    }

    const tamirTuri = this.tamirTuriRepository.create(createTamirTuriDto);
    return await this.tamirTuriRepository.save(tamirTuri);
  }

  async findAll(query: any): Promise<{ items: TamirTuri[]; total: number }> {
    const { search, page = 1, limit = 10 } = query;
    
    const where: any = {};
    
    if (search) {
      where.nomi = Like(`%${search}%`);
    }

    const [items, total] = await this.tamirTuriRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { yaratilganVaqt: 'DESC' },
    });

    return { items, total };
  }

  async getDropdown(): Promise<{ id: number; nomi: string; kodi: string }[]> {
    const items = await this.tamirTuriRepository.find({
      select: ['id', 'nomi', 'kodi'],
      order: { nomi: 'ASC' }
    });
    return items;
  }

  async findOne(id: number): Promise<TamirTuri> {
    const item = await this.tamirTuriRepository.findOne({ 
      where: { id },
      relations: ['tamirMuddatlari', 'tamirJadvallari']
    });
    
    if (!item) {
      throw new NotFoundException('Tamir turi topilmadi');
    }

    return item;
  }

  async findByKod(kodi: string): Promise<TamirTuri> {
    const item = await this.tamirTuriRepository.findOne({ 
      where: { kodi }
    });
    
    if (!item) {
      throw new NotFoundException('Tamir turi topilmadi');
    }

    return item;
  }

  async update(id: number, updateTamirTuriDto: UpdateTamirTuriDto): Promise<TamirTuri> {
    const item = await this.findOne(id);

    // Check if code exists for other items
    if (updateTamirTuriDto.kodi) {
      const existing = await this.tamirTuriRepository.findOne({
        where: { kodi: updateTamirTuriDto.kodi }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Bunday tamir turi kodi allaqachon mavjud');
      }
    }

    await this.tamirTuriRepository.update(id, updateTamirTuriDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    
    // Check if it has related records
    if (item.tamirMuddatlari?.length > 0 || item.tamirJadvallari?.length > 0) {
      throw new ConflictException('Bu tamir turiga bog\'langan ma\'lumotlar mavjud');
    }

    await this.tamirTuriRepository.remove(item);
  }
}