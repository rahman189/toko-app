import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserRole } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtPayload } from './strategies/jwt.strategy.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser =
      await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      12,
    );

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.STAFF,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user =
      await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is inactive',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn:
        this.configService.get<string>(
          'JWT_EXPIRES_IN',
        ) ?? '5h',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}