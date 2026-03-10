// src/vagon-tamir-muddatlari/vagon-tamir-muddatlari.controller.ts
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
import { VagonTamirMuddatlariService } from './vagon-tamir-muddatlari.service';
import { CreateVagonTamirMuddatiDto } from './dto/create-vagon-tamir-muddati.dto';
import { UpdateVagonTamirMuddatiDto } from './dto/update-vagon-tamir-muddati.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('vagon-tamir-muddatlari')
@Controller('vagon-tamir-muddatlari')
@ApiBearerAuth()
export class VagonTamirMuddatlariController {
  constructor(private readonly vagonTamirMuddatlariService: VagonTamirMuddatlariService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Yangi vagon tamir muddati qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Vagon tamir muddati yaratildi' })
  @ApiResponse({ status: 409, description: 'Bunday muddat allaqachon mavjud' })
  create(@Body() createVagonTamirMuddatiDto: CreateVagonTamirMuddatiDto) {
    return this.vagonTamirMuddatlariService.create(createVagonTamirMuddatiDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Barcha vagon tamir muddatlarini olish' })
  findAll(@Query() query: any) {
    return this.vagonTamirMuddatlariService.findAll(query);
  }

  @Get('vagon-turi/:vagonTuriId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagon turi bo\'yicha muddatlarni olish' })
  findByVagonTuri(@Param('vagonTuriId', ParseIntPipe) vagonTuriId: number) {
    return this.vagonTamirMuddatlariService.findByVagonTuri(vagonTuriId);
  }

  @Get('tamir-turi/:tamirTuriId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Tamir turi bo\'yicha muddatlarni olish' })
  findByTamirTuri(@Param('tamirTuriId', ParseIntPipe) tamirTuriId: number) {
    return this.vagonTamirMuddatlariService.findByTamirTuri(tamirTuriId);
  }

  @Get('vagon/:vagonId/tekshir')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagon uchun muddatni tekshirish' })
  checkVagonMuddat(@Param('vagonId', ParseIntPipe) vagonId: number) {
    return this.vagonTamirMuddatlariService.checkVagonMuddat(vagonId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER)
  @ApiOperation({ summary: 'Vagon tamir muddatini ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vagonTamirMuddatlariService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vagon tamir muddatini yangilash (faqat admin)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVagonTamirMuddatiDto: UpdateVagonTamirMuddatiDto
  ) {
    return this.vagonTamirMuddatlariService.update(id, updateVagonTamirMuddatiDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vagon tamir muddatini o\'chirish (faqat admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vagonTamirMuddatlariService.remove(id);
  }
}