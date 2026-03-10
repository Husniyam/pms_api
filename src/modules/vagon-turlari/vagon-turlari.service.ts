// src/vagon-turlari/vagon-turlari.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { VagonTuri } from './entities/vagon-turi.entity';
import { CreateVagonTuriDto } from './dto/create-vagon-turi.dto';
import { UpdateVagonTuriDto } from './dto/update-vagon-turi.dto';

@Injectable()
export class VagonTurlariService {
  constructor(
    @InjectRepository(VagonTuri)
    private vagonTuriRepository: Repository<VagonTuri>,
  ) {}

  async create(createVagonTuriDto: CreateVagonTuriDto): Promise<VagonTuri> {
    const existing = await this.vagonTuriRepository.findOne({
      where: { kodli: createVagonTuriDto.kodli }
    });

    if (existing) {
      throw new ConflictException('Bunday vagon turi kodi allaqachon mavjud');
    }

    const vagonTuri = this.vagonTuriRepository.create(createVagonTuriDto);
    return await this.vagonTuriRepository.save(vagonTuri);
  }

  async findAll(query: any): Promise<{ items: VagonTuri[]; total: number }> {
    const { search, page = 1, limit = 10 } = query;
    
    const where: any = {};
    if (search) {
      where.nomi = Like(`%${search}%`);
    }

    const [items, total] = await this.vagonTuriRepository.findAndCount({
      where,
      relations: ['vagonlar'],
      skip: (page - 1) * limit,
      take: limit,
      order: { yaratilganVaqt: 'DESC' },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<VagonTuri> {
    const item = await this.vagonTuriRepository.findOne({ 
      where: { id },
      relations: ['vagonlar', 'tamirMuddatlari']
    });
    
    if (!item) {
      throw new NotFoundException('Vagon turi topilmadi');
    }

    return item;
  }

  async update(id: number, updateDto: UpdateVagonTuriDto): Promise<VagonTuri> {
    const item = await this.findOne(id);

    if (updateDto.kodli) {
      const existing = await this.vagonTuriRepository.findOne({
        where: { kodli: updateDto.kodli }
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Bunday vagon turi kodi allaqachon mavjud');
      }
    }

    await this.vagonTuriRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.vagonTuriRepository.remove(item);
  }
}