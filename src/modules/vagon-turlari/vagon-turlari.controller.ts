// src/vagon-turlari/vagon-turlari.controller.ts
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
import { VagonTurlariService } from './vagon-turlari.service';
import { CreateVagonTuriDto } from './dto/create-vagon-turi.dto';
import { UpdateVagonTuriDto } from './dto/update-vagon-turi.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@ApiTags('vagon-turlari')
@Controller('vagon-turlari')
@ApiBearerAuth()
export class VagonTurlariController {
  constructor(private readonly vagonTurlariService: VagonTurlariService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Yangi vagon turi qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Vagon turi yaratildi' })
  @ApiResponse({ status: 409, description: 'Bunday vagon turi kodi mavjud' })
  create(@Body() createVagonTuriDto: CreateVagonTuriDto) {
    return this.vagonTurlariService.create(createVagonTuriDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Barcha vagon turlarini olish' })
  findAll(@Query() query: any) {
    return this.vagonTurlariService.findAll(query);
  }

//   @Get('dropdown')
//   @ApiOperation({ summary: 'Vagon turlari dropdown uchun' })
//   getDropdown() {
//     return this.vagonTurlariService.getDropdown();
//   }

//   @Get('statistika')
//   @Roles(UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Vagon turlari statistikasi' })
//   getStatistics() {
//     return this.vagonTurlariService.getStatistics();
//   }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.GLAV_INGEENER, UserRole.MECHANIC)
  @ApiOperation({ summary: 'Vagon turini ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vagonTurlariService.findOne(id);
  }

//   @Get('kodli/:kodli')
//   @Roles(UserRole.ADMIN, UserRole.MANAGER)
//   @ApiOperation({ summary: 'Vagon turini kod bo\'yicha olish' })
//   findByKodli(@Param('kodli') kodli: string) {
//     return this.vagonTurlariService.findByKodli(kodli);
//   }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vagon turini yangilash (faqat admin)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVagonTuriDto: UpdateVagonTuriDto
  ) {
    return this.vagonTurlariService.update(id, updateVagonTuriDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vagon turini o\'chirish (faqat admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vagonTurlariService.remove(id);
  }
}