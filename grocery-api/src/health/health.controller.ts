import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  check() {
    return {
      status: 'ok',
      service: 'grocery-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('database')
  @HttpCode(HttpStatus.OK)
  async checkDatabase() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}