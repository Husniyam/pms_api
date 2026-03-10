// src/tamir-jadvali/dto/create-tamir-jadvali.dto.ts
import { IsNumber, IsDateString, IsEnum, IsOptional, IsDecimal, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TamirHolati } from '../entities/tamir-jadvali.entity';

export class CreateTamirJadvaliDto {
  @ApiProperty({ description: 'Vagon ID', example: 1 })
  @IsNumber()
  vagonId: number;

  @ApiProperty({ description: 'Tamir turi ID', example: 1 })
  @IsNumber()
  tamirTuriId: number;

  @ApiProperty({ description: 'Vagon tamir muddati ID', example: 1 })
  @IsNumber()
  vagonTamirMuddatiId: number;

  @ApiProperty({ description: 'Tashkilot ID', example: 1 })
  @IsNumber()
  tashkilotId: number;

  @ApiProperty({ description: 'Rejalashtirilgan sana', example: '2024-01-15' })
  @IsDateString()
  rejalashtirilganSana: string;

  @ApiPropertyOptional({ description: 'Amalga oshirilgan sana', example: '2024-01-20' })
  @IsOptional()
  @IsDateString()
  amalgaOshirilganSana?: string;

  @ApiProperty({ description: 'Tamir holati', enum: TamirHolati })
  @IsEnum(TamirHolati)
  holati: TamirHolati;

  @ApiPropertyOptional({ description: 'Tamir qiymati', example: 1500000.00 })
  @IsOptional()
  @IsDecimal()
  tamirQiymati?: number;

  @ApiPropertyOptional({ description: 'Izoh', example: 'Muntazam texnik ko\'rik' })
  @IsOptional()
  izoh?: string;
}

export class CreateTamirJadvaliwithUserDto {
  @ApiProperty({ description: 'Vagon ID', example: 1 })
  @IsNumber()
  vagonId: number;

  @ApiProperty({ description: 'Tamir turi ID', example: 1 })
  @IsNumber()
  tamirTuriId: number;

  @ApiProperty({ description: 'Vagon tamir muddati ID', example: 1 })
  @IsNumber()
  vagonTamirMuddatiId: number;

  @ApiProperty({ description: 'Tashkilot ID', example: 1 })
  @IsNumber()
  tashkilotId: number;

  @ApiProperty({ description: 'Foydalanuvchi ID', example: 'uuid-string' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Rejalashtirilgan sana', example: '2024-01-15' })
  @IsDateString()
  rejalashtirilganSana: string;

  @ApiPropertyOptional({ description: 'Amalga oshirilgan sana', example: '2024-01-20' })
  @IsOptional()
  @IsDateString()
  amalgaOshirilganSana?: string;

  @ApiProperty({ description: 'Tamir holati', enum: TamirHolati })
  @IsEnum(TamirHolati)
  holati: TamirHolati;

  @ApiPropertyOptional({ description: 'Tamir qiymati', example: 1500000.00 })
  @IsOptional()
  @IsDecimal()
  tamirQiymati?: number;

  @ApiPropertyOptional({ description: 'Izoh', example: 'Muntazam texnik ko\'rik' })
  @IsOptional()
  izoh?: string;
}