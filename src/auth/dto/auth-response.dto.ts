// src/auth/dto/auth-response.dto.ts
import { User } from '../../users/entities/user.entity';

export class AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: Partial<User>;
}

export class TokenPayload {
  sub: string;
  jshshir: string;
  role: string;
  status: string;
}