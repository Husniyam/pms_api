// src/tamir-turlari/dto/update-tamir-turi.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTamirTuriDto } from './create-tamir-turi.dto';

export class UpdateTamirTuriDto extends PartialType(CreateTamirTuriDto) {}