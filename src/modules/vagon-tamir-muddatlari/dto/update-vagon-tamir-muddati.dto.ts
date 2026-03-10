
// src/vagon-tamir-muddatlari/dto/update-vagon-tamir-muddati.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateVagonTamirMuddatiDto } from './create-vagon-tamir-muddati.dto';

export class UpdateVagonTamirMuddatiDto extends PartialType(CreateVagonTamirMuddatiDto) {}