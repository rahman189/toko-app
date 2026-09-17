import {
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { Reflector } from '@nestjs/core';

import { UserRole } from '../../generated/prisma/enums.js';

import { RolesGuard } from './roles.guard.js';

import { ROLES_KEY } from '../decorators/roles.decorator.js';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();

    guard = new RolesGuard(
      reflector,
    );
  });

  it('should allow when no roles are required', () => {
    const getAllAndOverride =
      () => undefined;

    reflector.getAllAndOverride =
      getAllAndOverride as any;

    const context = {
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('should allow ADMIN role', () => {
    reflector.getAllAndOverride =
      () => [UserRole.ADMIN] as any;

    const context = {
      getHandler: () => {},
      getClass: () => {},

      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            role: UserRole.ADMIN,
          },
        }),
      }),
    } as ExecutionContext;

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('should reject unauthorized role', () => {
    reflector.getAllAndOverride =
      () => [UserRole.ADMIN] as any;

    const context = {
      getHandler: () => {},
      getClass: () => {},

      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            role: UserRole.STAFF,
          },
        }),
      }),
    } as ExecutionContext;

    expect(() =>
      guard.canActivate(context),
    ).toThrow(
      ForbiddenException,
    );
  });
});