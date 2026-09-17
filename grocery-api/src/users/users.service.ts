import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from '../auth/dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    const data: {
      name?: string;
      email?: string;
      password?: string;
      role?: UpdateUserDto['role'];
      isActive?: boolean;
    } = {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      isActive: dto.isActive,
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 12);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}