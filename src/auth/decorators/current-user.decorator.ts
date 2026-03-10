// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

/**
 * Joriy foydalanuvchini olish uchun decorator
 * 
 * @example
 * // To'liq user obyektini olish
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * 
 * @example
 * // Faqat user ID sini olish
 * @Get('profile')
 * getProfile(@CurrentUser('id') userId: string) {
 *   return userId;
 * }
 * 
 * @example
 * // Faqat user emailini olish
 * @Get('profile')
 * getProfile(@CurrentUser('email') email: string) {
 *   return email;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    // Agar user bo'lmasa, unauthorized
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi tizimga kirmagan');
    }

    // Agar data (masalan 'id', 'email') berilgan bo'lsa, shu fieldni qaytarish
    if (data) {
      return user[data];
    }

    // Aks holda to'liq user obyektini qaytarish
    return user;
  },
);