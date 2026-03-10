// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Yangi foydalanuvchi qo\'shish (faqat admin)' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi yaratildi' })
  @ApiResponse({ status: 409, description: 'Bunday foydalanuvchi mavjud' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish (faqat admin)' })
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Foydalanuvchi profilini olish' })
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get('profile/:field')
  @ApiOperation({ summary: 'Foydalanuvchi profilidan ma\'lum fieldni olish' })
  getProfileField(@CurrentUser('id') id: string, @Param('field') field: string) {
    return { id, field };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchini ID bo\'yicha olish' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchini yangilash (faqat admin)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchi statusini o\'zgartirish' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.usersService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish (faqat admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}