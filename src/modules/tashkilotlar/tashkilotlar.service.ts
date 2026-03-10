// src/tashkilotlar/tashkilotlar.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tashkilot } from './entities/tashkilot.entity';
import { CreateTashkilotDto } from './dto/create-tashkilot.dto';
import { UpdateTashkilotDto } from './dto/update-tashkilot.dto';

@Injectable()
export class TashkilotlarService {
  constructor(
    @InjectRepository(Tashkilot)
    private tashkilotRepository: Repository<Tashkilot>,
  ) {}

  async create(createTashkilotDto: CreateTashkilotDto): Promise<Tashkilot> {
    // Check if code exists
    const existing = await this.tashkilotRepository.findOne({
      where: { kod: createTashkilotDto.kod }
    });

    if (existing) {
      throw new ConflictException('Bunday tashkilot kodi allaqachon mavjud');
    }

    const tashkilot = this.tashkilotRepository.create(createTashkilotDto);
    return await this.tashkilotRepository.save(tashkilot);
  }

  async findAll(query: any): Promise<{ items: Tashkilot[]; total: number }> {
    const { search, page = 1, limit = 10 } = query;
    
    const where: any = {};
    
    if (search) {
      where.nomi = Like(`%${search}%`);
    }

    const [items, total] = await this.tashkilotRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { nomi: 'ASC' },
    });

    return { items, total };
  }

  async getDropdown(): Promise<{ id: number; nomi: string; kod: string }[]> {
    const items = await this.tashkilotRepository.find({
      select: ['id', 'nomi', 'kod'],
      order: { nomi: 'ASC' }
    });
    return items;
  }

  async findOne(id: number): Promise<Tashkilot> {
    const item = await this.tashkilotRepository.findOne({ 
      where: { id },
      relations: ['tamirJadvallari']
    });
    
    if (!item) {
      throw new NotFoundException('Tashkilot topilmadi');
    }

    return item;
  }

  async findByKod(kod: string): Promise<Tashkilot> {
    const item = await this.tashkilotRepository.findOne({ 
      where: { kod }
    });
    
    if (!item) {
      throw new NotFoundException('Tashkilot topilmadi');
    }

    return item;
  }

  async update(id: number, updateTashkilotDto: UpdateTashkilotDto): Promise<Tashkilot> {
    const item = await this.findOne(id);

    // Check if code exists for other items
    if (updateTashkilotDto.kod) {
      const existing = await this.tashkilotRepository.findOne({
        where: { kod: updateTashkilotDto.kod }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Bunday tashkilot kodi allaqachon mavjud');
      }
    }

    await this.tashkilotRepository.update(id, updateTashkilotDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    
    // Check if it has related tamir jadvallari
    if (item.tamirJadvallari?.length > 0) {
      throw new ConflictException('Bu tashkilotga bog\'langan tamir jadvallari mavjud');
    }

    await this.tashkilotRepository.remove(item);
  }
}