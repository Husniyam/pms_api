// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Public decorator tekshirish
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar public bo'lsa, guard dan o'tkazib yuborish
    if (isPublic) {
      return true;
    }

    // Aks holda JWT validation
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // JWT validation xatoliklarini handle qilish
    if (err || !user) {
      throw err || new UnauthorizedException('Token noto\'g\'ri yoki muddati o\'tgan');
    }
    return user;
  }
}