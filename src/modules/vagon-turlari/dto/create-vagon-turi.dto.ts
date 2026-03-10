// src/vagon-turlari/dto/create-vagon-turi.dto.ts
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVagonTuriDto {
  @ApiProperty({ description: 'Vagon turi nomi', example: 'Yuk vagoni' })
  @IsString()
  @MinLength(2)
  nomi: string;

  @ApiProperty({ description: 'Vagon turi kodi', example: 'YUK-001' })
  @IsString()
  @MinLength(2)
  kodli: string;

  @ApiPropertyOptional({ description: 'Vagon turi tavsifi', example: 'Og\'ir yuk tashish uchun' })
  @IsOptional()
  @IsString()
  tavsifi?: string;
}
