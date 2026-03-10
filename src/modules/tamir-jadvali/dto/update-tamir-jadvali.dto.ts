
// src/roles/dto/update-role.dto.ts
import { PartialType } from '@nestjs/swagger';
import { TamirJadval } from '../entities/tamir-jadvali.entity';

export class UpdateTamirJadvaliDto extends PartialType(TamirJadval) {}