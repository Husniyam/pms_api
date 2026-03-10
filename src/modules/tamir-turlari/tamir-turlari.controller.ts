// src/tamir-turlari/tamir-turlari.controller.ts
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
import { TamirTurlariService } from './tamir-turlari.service';
import { CreateTamirTuriDto } from './dto/create-tamir-turi.dto';
import { UpdateTamirTuriDto } from './dto/update-tamir-turi.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('tamir-turlari')
@Controller('tamir-turlari')
@ApiBearerAuth()
export class TamirTurlariController {
  constructor(private readonly tamirTurlariService: TamirTurlariService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Yangi tamir turi qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Tamir turi yaratildi' })
  @ApiResponse({ status: 409, description: 'Bunday tamir turi kodi mavjud' })
  create(@Body() createTamirTuriDto: CreateTamirTuriDto) {
    return this.tamirTurlariService.create(createTamirTuriDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Barcha tamir turlarini olish' })
  findAll(@Query() query: any) {
    return this.tamirTurlariService.findAll(query);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Tamir turlari dropdown uchun' })
  getDropdown() {
    return this.tamirTurlariService.getDropdown();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Tamir turini ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tamirTurlariService.findOne(id);
  }

  @Get('kodi/:kodi')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Tamir turini kod bo\'yicha olish' })
  findByKod(@Param('kodi') kodi: string) {
    return this.tamirTurlariService.findByKod(kodi);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tamir turini yangilash (faqat admin)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTamirTuriDto: UpdateTamirTuriDto
  ) {
    return this.tamirTurlariService.update(id, updateTamirTuriDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tamir turini o\'chirish (faqat admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tamirTurlariService.remove(id);
  }
}