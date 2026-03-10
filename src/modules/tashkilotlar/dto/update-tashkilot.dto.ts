
// src/tashkilotlar/dto/update-tashkilot.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTashkilotDto } from './create-tashkilot.dto';

export class UpdateTashkilotDto extends PartialType(CreateTashkilotDto) {}