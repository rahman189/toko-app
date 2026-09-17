// src/auth/strategies/jwt.strategy.ts

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import {
  PassportStrategy,
} from '@nestjs/passport';

import { UserRole } from '../../generated/prisma/enums.js';

import { UsersService } from '../../users/users.service.js';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret =
      configService.get<string>(
        'JWT_SECRET',
      );

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: secret,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<AuthUser> {
    const user =
      await this.usersService.findById(
        payload.sub,
      );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is inactive',
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}