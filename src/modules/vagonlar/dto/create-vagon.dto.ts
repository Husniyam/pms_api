// src/vagonlar/dto/create-vagon.dto.ts
import { IsString, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VagonHolati } from '../entities/vagon.entity';

export class CreateVagonDto {
  @ApiProperty({ description: 'Vagon raqami', example: 'VGN-12345' })
  @IsString()
  raqami: string;

  @ApiProperty({ description: 'Vagon turi ID', example: 1 })
  @IsNumber()
  vagonTuriId: number;

  @ApiProperty({ description: 'Ishlab chiqarilgan sana', example: '2020-01-01' })
  @IsDateString()
  ishlabChigarilganSana: string;

  @ApiProperty({ description: 'Bosib o\'tgan km', example: 15000 })
  @IsNumber()
  @Min(0)
  bosibOtganKm: number;

  @ApiProperty({ description: 'Vagon holati', enum: VagonHolati, example: VagonHolati.ACTIVE })
  @IsEnum(VagonHolati)
  holati: VagonHolati;
}