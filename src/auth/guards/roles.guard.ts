// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Roleni handler va class dan olish
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar role talab qilinmasa, ruxsat berish
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Agar user bo'lmasa, ruxsat bermaslik
    if (!user) {
      throw new ForbiddenException('Sizga bu amalni bajarish uchun ruxsat yo\'q');
    }

    // Admin hamma narsaga ruxsat (agar kerak bo'lsa)
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Userning roli required rolar ichida bormi?
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(`Sizga bu amalni bajarish uchun ${requiredRoles.join(', ')} roli kerak`);
    }

    return true;
  }
}