// src/tamir-jadvali/tamir-jadvali.controller.ts
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
import { TamirJadvaliService } from './tamir-jadvali.service';
import { CreateTamirJadvaliDto } from './dto/create-tamir-jadvali.dto';
import { UpdateTamirJadvaliDto } from './dto/update-tamir-jadvali.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CurrentUser, Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('tamir-jadvali')
@Controller('tamir-jadvali')
@ApiBearerAuth()
export class TamirJadvaliController {
  constructor(private readonly tamirJadvaliService: TamirJadvaliService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Yangi tamir jadvali qo\'shish' })
  @ApiResponse({ status: 201, description: 'Tamir jadvali yaratildi' })
  @ApiResponse({ status: 404, description: 'Vagon yoki tamir turi topilmadi' })
  create(@Body() createTamirJadvaliDto: CreateTamirJadvaliDto, @CurrentUser() user: User) {
    // createTamirJadvaliDto.userId = user.id;
    return this.tamirJadvaliService.create({...createTamirJadvaliDto, userId: user.id});
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Barcha tamir jadvallarini olish' })
  findAll(@Query() query: any) {
    return this.tamirJadvaliService.findAll(query);
  }

  @Get('vagon/:vagonId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagon bo\'yicha tamir jadvallarini olish' })
  findByVagon(@Param('vagonId', ParseIntPipe) vagonId: number, @Query() query: any) {
    return this.tamirJadvaliService.findByVagon(vagonId, query);
  }

  @Get('tashkilot/:tashkilotId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Tashkilot bo\'yicha tamir jadvallarini olish' })
  findByTashkilot(@Param('tashkilotId', ParseIntPipe) tashkilotId: number, @Query() query: any) {
    return this.tamirJadvaliService.findByTashkilot(tashkilotId, query);
  }

  @Get('bugungi')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Bugungi tamir jadvallarini olish' })
  getTodaySchedule() {
    return this.tamirJadvaliService.getTodaySchedule();
  }

  @Get('muddati-otgan')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Muddati o\'tgan tamir jadvallarini olish' })
  getOverdueSchedule() {
    return this.tamirJadvaliService.getOverdueSchedule();
  }

  @Get('statistika')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Tamir jadvali statistikasini olish' })
  getStatistics() {
    return this.tamirJadvaliService.getStatistics();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Tamir jadvalini ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tamirJadvaliService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Tamir jadvalini yangilash' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTamirJadvaliDto: UpdateTamirJadvaliDto
  ) {
    return this.tamirJadvaliService.update(id, updateTamirJadvaliDto);
  }

  @Patch(':id/holati')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Tamir jadvali holatini o\'zgartirish' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('holati') holati: string
  ) {
    return this.tamirJadvaliService.updateStatus(id, holati);
  }

  @Patch(':id/tugallash')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Tamirni tugallash' })
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Body('tamirQiymati') tamirQiymati: number,
    @Body('izoh') izoh?: string
  ) {
    return this.tamirJadvaliService.complete(id, tamirQiymati, izoh);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tamir jadvalini o\'chirish (faqat admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tamirJadvaliService.remove(id);
  }
}