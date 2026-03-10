// src/users/dto/create-user.dto.ts
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsEnum, 
  IsOptional,
  IsPhoneNumber 
} from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ 
    description: 'Foydalanuvchining email manzili', 
    example: 'user@example.com' 
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Foydalanuvchining username\'i', 
    example: 'john_doe' 
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ 
    description: 'Foydalanuvchining JSHSHIR raqami', 
    example: '1234567890123456' 
  })
  @IsString()
  @MinLength(14)
  jshshir: string;

  @ApiProperty({ 
    description: 'Foydalanuvchining ismi', 
    example: 'John' 
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'Foydalanuvchining familiyasi', 
    example: 'Doe' 
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Foydalanuvchining paroli', 
    example: 'password123' 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ 
    description: 'Foydalanuvchining telefon raqami', 
    example: '+998901234567' 
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiProperty({ 
    description: 'Foydalanuvchining roli', 
    example: UserRole.USER, 
    enum: UserRole 
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ 
    description: 'Foydalanuvchining statusi', 
    example: UserStatus.ACTIVE, 
    enum: UserStatus 
  })
  @IsEnum(UserStatus)
  status?: UserStatus;
}