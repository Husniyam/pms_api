// src/auth/auth.service.ts
import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/login.dto';
import { AuthResponse, TokenPayload } from './dto/auth-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  

  async validateUser(jshshir: string, password: string): Promise<User> {
    console.log(jshshir, password);
    
    const user = await this.userRepository.findOne({ where: { jshshir } });
console.log(user);

    if (!user) {
      throw new UnauthorizedException('JSHSHIR noto\'g\'ri');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Hisob faol emas. Iltimos, admin bilan bog\'laning');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);  
    console.log(isPasswordValid);
      
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('JSHSHIR yoki parol noto\'g\'ri');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    console.log(loginDto);
    
    const user = await this.validateUser(loginDto.jshshir, loginDto.password);

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);

    // Remove password from response
    // delete user.password;

    return {
      ...tokens,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { jshshir: registerDto.jshshir },
        { username: registerDto.username }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Bunday foydalanuvchi allaqachon mavjud');
    }

     const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user with GUEST role
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.GUEST,
      status: UserStatus.PENDING,
      isEmailVerified: false,
      emailVerificationToken: uuidv4(),
    });
    await this.userRepository.save(user);
    
    // Generate tokens
    const tokens = await this.generateTokens(user);
    
    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);

    // Remove password from response
    // delete user.password;

    return {
      ...tokens,
      expiresIn: 7 * 24 * 60 * 60,
      user,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Find user
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, refreshToken },
      });

      if (!user) {
        throw new UnauthorizedException('Token noto\'g\'ri');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update refresh token
      user.refreshToken = tokens.refreshToken;
      await this.userRepository.save(user);

    //   delete user.password;

      return {
        ...tokens,
        expiresIn: 7 * 24 * 60 * 60,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException('Token noto\'g\'ri yoki muddati o\'tgan');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // Security: don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await this.userRepository.save(user);
 
    // TODO: Send email with reset link
    // await this.mailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { 
        passwordResetToken: resetPasswordDto.token,
      },
    });

    if (!user || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token noto\'g\'ri yoki muddati o\'tgan');
    }

    // Update password
    user.password = resetPasswordDto.password;
    user.passwordResetToken = null as any;
    user.passwordResetExpires = null as any;
    await this.userRepository.save(user);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Token noto\'g\'ri');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null as any;
    user.status = UserStatus.PENDING; // Still pending until admin approves
    await this.userRepository.save(user);
  }

  // Yangi: User ni ID bo'yicha topish
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'jshshir'] // password ni qaytarmaymiz
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }
 

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      sub: user.id,
      jshshir: user.jshshir,
      role: user.role,
      status: user.status,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m', // Access token expires in 15 minutes
        secret: this.configService.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d', // Refresh token expires in 7 days
        secret: this.configService.get('JWT_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}