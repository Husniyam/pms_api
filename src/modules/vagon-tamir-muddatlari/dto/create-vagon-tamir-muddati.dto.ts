// src/vagon-tamir-muddatlari/dto/create-vagon-tamir-muddati.dto.ts
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVagonTamirMuddatiDto {
  @ApiProperty({ description: 'Vagon turi ID', example: 1 })
  @IsNumber()
  vagonTuriId: number;

  @ApiProperty({ description: 'Tamir turi ID', example: 1 })
  @IsNumber()
  tamirTuriId: number;

  @ApiProperty({ description: 'Muddat (oy)', example: 12 })
  @IsNumber()
  @Min(1)
  muddatOy: number;

  @ApiProperty({ description: 'Maksimal km', example: 50000 })
  @IsNumber()
  @Min(0)
  maksimalKm: number;

  @ApiPropertyOptional({ description: 'Izoh', example: 'Har yili majburiy tekshiruv' })
  @IsOptional()
  @IsString()
  izoh?: string;
}
