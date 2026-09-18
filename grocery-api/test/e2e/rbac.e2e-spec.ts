import {
  INestApplication,
} from '@nestjs/common';

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

import request from 'supertest';

import { createTestApp } from './test-app.js';

import { PrismaService } from '../../src/prisma/prisma.service.js';

import { UserRole } from '../../src/generated/prisma/enums.js';

describe('RBAC E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken: string;
  let staffToken: string;
  let cashierToken: string;

  const timestamp = Date.now();

  const adminEmail =
    `rbac-admin-${timestamp}@example.com`;

  const staffEmail =
    `rbac-staff-${timestamp}@example.com`;

  const cashierEmail =
    `rbac-cashier-${timestamp}@example.com`;

  const password = 'Password123!';

  beforeAll(async () => {
    app = await createTestApp();

    prisma = app.get(PrismaService);

    await createUserAndLogin(
      adminEmail,
      UserRole.ADMIN,
      (token) => {
        adminToken = token;
      },
    );

    await createUserAndLogin(
      staffEmail,
      UserRole.STAFF,
      (token) => {
        staffToken = token;
      },
    );

    await createUserAndLogin(
      cashierEmail,
      UserRole.CASHIER,
      (token) => {
        cashierToken = token;
      },
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            adminEmail,
            staffEmail,
            cashierEmail,
          ],
        },
      },
    });

    await app.close();
  });

  async function createUserAndLogin(
    email: string,
    role: UserRole,
    setToken: (token: string) => void,
  ): Promise<void> {
    const registerResponse =
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: `${role} E2E User`,
          email,
          password,
        })
        .expect(200);

    const userId = registerResponse.body.id;

    expect(userId).toBeDefined();

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    });

    const loginResponse =
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        })
        .expect(200);

    expect(
      loginResponse.body.accessToken,
    ).toBeDefined();

    setToken(
      loginResponse.body.accessToken,
    );
  }

  it('should allow ADMIN to create category', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .set(
          'Authorization',
          `Bearer ${adminToken}`,
        )
        .send({
          name: `Admin Category ${timestamp}`,
        })
        .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(
      `Admin Category ${timestamp}`,
    );
  });

  it('should allow STAFF to create category', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .set(
          'Authorization',
          `Bearer ${staffToken}`,
        )
        .send({
          name: `Staff Category ${timestamp}`,
        })
        .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(
      `Staff Category ${timestamp}`,
    );
  });

  it('should reject CASHIER from creating category', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .set(
          'Authorization',
          `Bearer ${cashierToken}`,
        )
        .send({
          name: `Cashier Category ${timestamp}`,
          slug: `cashier-category-${timestamp}`,
        })
        .expect(403);

    expect(response.body).toMatchObject({
      statusCode: 403,
      error: 'Forbidden',
    });
  });

  it('should reject request without token', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: `No Token Category ${timestamp}`,
          slug: `no-token-category-${timestamp}`,
        })
        .expect(401);

    expect(response.body).toMatchObject({
      statusCode: 401,
      error: 'Unauthorized',
    });
  });

  it('should reject invalid JWT', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .set(
          'Authorization',
          'Bearer invalid-token',
        )
        .send({
          name: `Invalid Token Category ${timestamp}`,
          slug: `invalid-token-category-${timestamp}`,
        })
        .expect(401);

    expect(response.body).toMatchObject({
      statusCode: 401,
      error: 'Unauthorized',
    });
  });
});