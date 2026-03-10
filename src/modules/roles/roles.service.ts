// src/roles/roles.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if role code exists
    const existingRole = await this.roleRepository.findOne({
      where: { kod: createRoleDto.kod }
    });

    if (existingRole) {
      throw new ConflictException('Bunday rol kodi allaqachon mavjud');
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(query: any): Promise<{ roles: Role[]; total: number }> {
    const { search, page = 1, limit = 10 } = query;
    
    const where: any = {};
    
    if (search) {
      where.nomi = Like(`%${search}%`);
    }

    const [roles, total] = await this.roleRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { yaratilganVaqt: 'DESC' },
    });

    return { roles, total };
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    
    if (!role) {
      throw new NotFoundException('Rol topilmadi');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Check if code exists for other roles
    if (updateRoleDto.kod) {
      const existingRole = await this.roleRepository.findOne({
        where: { kod: updateRoleDto.kod }
      });

      if (existingRole && existingRole.id !== id) {
        throw new ConflictException('Bunday rol kodi allaqachon mavjud');
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}