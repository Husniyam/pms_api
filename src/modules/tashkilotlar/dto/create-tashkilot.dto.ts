// src/tashkilotlar/dto/create-tashkilot.dto.ts
import { IsString, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTashkilotDto {
  @ApiProperty({ description: 'Tashkilot nomi', example: 'Temiryo\'l ta\'mirlash zavodi' })
  @IsString()
  @MinLength(2)
  nomi: string;

  @ApiProperty({ description: 'Tashkilot kodi', example: 'TRZ-001' })
  @IsString()
  @MinLength(2)
  kod: string;

  @ApiPropertyOptional({ description: 'Tashkilot tavsifi', example: 'Asosiy ta\'mirlash zavodi' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Telefon raqam', example: '+998901234567' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  telefon?: string;

  @ApiPropertyOptional({ description: 'Manzil', example: 'Toshkent, Yangi yo\'l ko\'chasi, 15' })
  @IsOptional()
  @IsString()
  manzil?: string;
}