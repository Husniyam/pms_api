// src/users/users.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { jshshir: createUserDto.jshshir },
        { username: createUserDto.username }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Bunday foydalanuvchi allaqachon mavjud');
    }
    // Check if userphone exists
    const existingPhone = await this.userRepository.findOne({
      where: [
        { phone: createUserDto.phone }
      ]
    });

    if (existingPhone) {
      throw new ConflictException('Bunday telefon raqam allaqachon mavjud');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      status: createUserDto.status || UserStatus.ACTIVE,
      isEmailVerified: true, // Admin creates, so email is verified
    });
    await this.userRepository.save(user);
    
    return user;
  }

  async findAll(query: any): Promise<{ users: User[]; total: number }> {
    const { role, status, search, page = 1, limit = 10 } = query;
    
    const where: any = {};
    
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.username = Like(`%${search}%`);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Remove passwords
    // users.forEach(user => delete user.password);

    return { users, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAllByRole(role: UserRole): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { role, status: UserStatus.ACTIVE },
      order: { firstName: 'ASC' },
    });

    // users.forEach(user => delete user.password);
    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if email/username already exists
    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: [
          ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
          ...(updateUserDto.username ? [{ username: updateUserDto.username }] : []),
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email yoki username allaqachon mavjud');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: string): Promise<User> {
    const user = await this.findOne(id);
    
    if (!Object.values(UserStatus).includes(status as UserStatus)) {
      throw new BadRequestException('Noto\'g\'ri status');
    }

    user.status = status as UserStatus;
    await this.userRepository.save(user);

    // delete user.password;
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}