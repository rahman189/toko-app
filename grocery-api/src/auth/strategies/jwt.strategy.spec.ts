import {
  UnauthorizedException,
} from '@nestjs/common';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ConfigService } from '@nestjs/config';

import {
  JwtStrategy,
} from './jwt.strategy.js';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const configServiceMock: Partial<ConfigService> = {
  get: vi.fn((key: string) => {
    if (key === 'JWT_SECRET') {
      return 'test-secret';
    }

    return undefined;
  }),
};

  const usersServiceMock = {
    findById: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    strategy = new JwtStrategy(
      configServiceMock as ConfigService,
      usersServiceMock as any,
    );
  });

  it('should validate active user', async () => {
    usersServiceMock.findById.mockResolvedValue(
      {
        id: 'user-1',
        name: 'Rahman',
        email: 'rahman@example.com',
        role: 'ADMIN',
        isActive: true,
      },
    );

    const result =
      await strategy.validate({
        sub: 'user-1',
        role: 'ADMIN',
      });

    expect(result).toEqual({
      id: 'user-1',
      name: 'Rahman',
      email: 'rahman@example.com',
      role: 'ADMIN',
      isActive: true,
    });
  });

  it('should reject unknown user', async () => {
    usersServiceMock.findById.mockResolvedValue(
      null,
    );

    await expect(
      strategy.validate({
        sub: 'unknown',
        role: 'STAFF',
      }),
    ).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should reject inactive user', async () => {
    usersServiceMock.findById.mockResolvedValue(
      {
        id: 'user-1',
        name: 'Rahman',
        email: 'rahman@example.com',
        role: 'STAFF',
        isActive: false,
      },
    );

    await expect(
      strategy.validate({
        sub: 'user-1',
        role: 'STAFF',
      }),
    ).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});