// src/roles/dto/create-role.dto.ts
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Rol nomi', example: 'Administrator' })
  @IsString()
  @MinLength(2)
  nomi: string;

  @ApiProperty({ description: 'Rol kodi', example: 'admin' })
  @IsString()
  @MinLength(2)
  kod: string;

  @ApiPropertyOptional({ description: 'Rol tavsifi', example: 'Tizim administratori' })
  @IsOptional()
  @IsString()
  tavsifi?: string;
}
