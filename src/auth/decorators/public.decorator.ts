// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Public endpointlar uchun decorator
 * JWT guard dan o'tkazib yuborish uchun
 * 
 * @example
 * @Public()
 * @Get('public')
 * publicEndpoint() {
 *   return 'This is public';
 * }
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);