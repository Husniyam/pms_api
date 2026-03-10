// src/vagonlar/vagonlar.controller.ts
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
import { VagonlarService } from './vagonlar.service';
import { CreateVagonDto } from './dto/create-vagon.dto';
import { UpdateVagonDto } from './dto/update-vagon.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('vagonlar')
@Controller('vagonlar')
@ApiBearerAuth()
export class VagonlarController {
  constructor(private readonly vagonlarService: VagonlarService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Yangi vagon qo\'shish' })
  @ApiResponse({ status: 201, description: 'Vagon yaratildi' })
  @ApiResponse({ status: 409, description: 'Bunday vagon raqami mavjud' })
  create(@Body() createVagonDto: CreateVagonDto) {
    return this.vagonlarService.create(createVagonDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Barcha vagonlarni olish' })
  findAll(@Query() query: any) {
    return this.vagonlarService.findAll(query);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Vagonlar dropdown uchun' })
  getDropdown() {
    return this.vagonlarService.getDropdown();
  }

  @Get('holat/:holati')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Holati bo\'yicha vagonlarni olish' })
  findByHolat(@Param('holati') holati: string) {
    return this.vagonlarService.findByHolat(holati);
  }

  @Get('turi/:vagonTuriId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagon turi bo\'yicha vagonlarni olish' })
  findByVagonTuri(@Param('vagonTuriId', ParseIntPipe) vagonTuriId: number) {
    return this.vagonlarService.findByVagonTuri(vagonTuriId);
  }

  @Get('ta\'mir-kerak')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Ta\'mir kerak bo\'lgan vagonlarni olish' })
  getRepairNeeded() {
    return this.vagonlarService.getRepairNeeded();
  }

  @Get('statistika')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Vagonlar statistikasi' })
  getStatistics() {
    return this.vagonlarService.getStatistics();
  }

  @Get('km-tekshir')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'KM limiti bo\'yicha tekshirish' })
  checkKmLimits() {
    return this.vagonlarService.checkKmLimits();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagonni ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vagonlarService.findOne(id);
  }

  @Get('raqam/:raqami')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagonni raqami bo\'yicha olish' })
  findByRaqam(@Param('raqami') raqami: string) {
    return this.vagonlarService.findByRaqam(raqami);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Vagonni yangilash' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVagonDto: UpdateVagonDto
  ) {
    return this.vagonlarService.update(id, updateVagonDto);
  }

  @Patch(':id/holat')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Vagon holatini o\'zgartirish' })
  updateHolat(
    @Param('id', ParseIntPipe) id: number,
    @Body('holati') holati: string
  ) {
    return this.vagonlarService.updateHolat(id, holati);
  }

  @Patch(':id/km')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagon KM ini yangilash' })
  updateKm(
    @Param('id', ParseIntPipe) id: number,
    @Body('km') km: number
  ) {
    return this.vagonlarService.updateKm(id, km);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vagonni o\'chirish (faqat admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vagonlarService.remove(id);
  }
}