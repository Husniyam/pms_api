// src/tashkilotlar/tashkilotlar.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { TashkilotlarService } from './tashkilotlar.service';
import { CreateTashkilotDto } from './dto/create-tashkilot.dto';
import { UpdateTashkilotDto } from './dto/update-tashkilot.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('tashkilotlar')
@Controller('tashkilotlar')
@ApiBearerAuth()
export class TashkilotlarController {
  constructor(private readonly tashkilotlarService: TashkilotlarService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Yangi tashkilot qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Tashkilot yaratildi' })
  @ApiResponse({ status: 409, description: 'Bunday tashkilot kodi mavjud' })
  create(@Body() createTashkilotDto: CreateTashkilotDto) {
    return this.tashkilotlarService.create(createTashkilotDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Barcha tashkilotlarni olish' })
  findAll(@Query() query: any) {
    return this.tashkilotlarService.findAll(query);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Tashkilotlar dropdown uchun' })
  getDropdown() {
    return this.tashkilotlarService.getDropdown();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Tashkilotni ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tashkilotlarService.findOne(id);
  }

  @Get('kod/:kod')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Tashkilotni kod bo\'yicha olish' })
  findByKod(@Param('kod') kod: string) {
    return this.tashkilotlarService.findByKod(kod);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tashkilotni yangilash (faqat admin)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTashkilotDto: UpdateTashkilotDto
  ) {
    return this.tashkilotlarService.update(id, updateTashkilotDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tashkilotni o\'chirish (faqat admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tashkilotlarService.remove(id);
  }
}