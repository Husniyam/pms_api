// src/tamir-turlari/dto/create-tamir-turi.dto.ts
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTamirTuriDto {
  @ApiProperty({ description: 'Tamir turi nomi', example: 'Kapital ta\'mirlash' })
  @IsString()
  @MinLength(2)
  nomi: string;

  @ApiProperty({ description: 'Tamir turi kodi', example: 'KAP-001' })
  @IsString()
  @MinLength(2)
  kodi: string;

  @ApiPropertyOptional({ description: 'Tamir turi tavsifi', example: 'To\'liq kapital ta\'mirlash' })
  @IsOptional()
  @IsString()
  tavsifi?: string;
}