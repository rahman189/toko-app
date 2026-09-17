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

describe('Categories E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let accessToken: string;
  let userId: string;

  let categoryId: string;

  const timestamp = Date.now();

  const email =
    `category-e2e-${timestamp}@example.com`;

  const password = 'Password123!';

  beforeAll(async () => {
    app = await createTestApp();

    prisma = app.get(PrismaService);

    /*
     * Create test user
     */
    const registerResponse =
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Category E2E Admin',
          email,
          password,
        })
        .expect(201);

    userId = registerResponse.body.id;

    /*
     * Change role to ADMIN
     */
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    /*
     * Login
     */
    const loginResponse =
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        })
        .expect(200);

    accessToken =
      loginResponse.body.accessToken;

    expect(accessToken).toBeDefined();
  });

  afterAll(async () => {
    /*
     * Cleanup categories created by this test.
     */
    await prisma.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    /*
     * Cleanup test user.
     */
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    await app.close();
  });

  // =====================================================
  // CREATE
  // =====================================================

  it('should create a category', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          name: `Minuman ${timestamp}`,
        })
        .expect(201);

    expect(response.body).toHaveProperty('id');

    expect(response.body.name).toBe(
      `Minuman ${timestamp}`,
    );

    expect(response.body.isActive).toBe(true);

    categoryId = response.body.id;
  });

  // =====================================================
  // GET BY ID
  // =====================================================

  it('should get category by id', async () => {
    const response =
      await request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body).toHaveProperty(
      'id',
      categoryId,
    );

    expect(response.body.name).toBe(
      `Minuman ${timestamp}`,
    );
  });

  // =====================================================
  // GET LIST
  // =====================================================

  it('should get categories', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/categories')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body).toHaveProperty('data');

    expect(response.body).toHaveProperty('meta');

    expect(
      Array.isArray(response.body.data),
    ).toBe(true);

    expect(response.body.meta).toHaveProperty(
      'page',
    );

    expect(response.body.meta).toHaveProperty(
      'limit',
    );

    expect(response.body.meta).toHaveProperty(
      'total',
    );

    expect(response.body.meta).toHaveProperty(
      'totalPages',
    );
  });

  // =====================================================
  // SEARCH
  // =====================================================

  it('should search categories', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/categories')
        .query({
          search: `Minuman ${timestamp}`,
        })
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(
      response.body.data.length,
    ).toBeGreaterThan(0);

    expect(
      response.body.data.some(
        (category: { id: string }) =>
          category.id === categoryId,
      ),
    ).toBe(true);
  });

  // =====================================================
  // FILTER ACTIVE
  // =====================================================

  it('should filter active categories', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/categories')
        .query({
          isActive: true,
        })
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(
      response.body.data.every(
        (category: { isActive: boolean }) =>
          category.isActive === true,
      ),
    ).toBe(true);
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  it('should paginate categories', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/categories')
        .query({
          page: 1,
          limit: 10,
        })
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body.meta).toMatchObject({
      page: 1,
      limit: 10,
    });

    expect(
      response.body.data.length,
    ).toBeLessThanOrEqual(10);
  });

  // =====================================================
  // UPDATE
  // =====================================================

  it('should update a category', async () => {
    const response =
      await request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          name: `Minuman Updated ${timestamp}`,
        })
        .expect(200);

    expect(response.body).toHaveProperty(
      'id',
      categoryId,
    );

    expect(response.body.name).toBe(
      `Minuman Updated ${timestamp}`,
    );
  });

  // =====================================================
  // NOT FOUND
  // =====================================================

  it('should return 404 for unknown category', async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          '/categories/00000000-0000-0000-0000-000000000000',
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
    });
  });

  // =====================================================
  // DELETE / SOFT DELETE
  // =====================================================

  it('should soft delete a category', async () => {
    const response =
      await request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body).toHaveProperty(
      'isActive',
      false,
    );
  });

  // =====================================================
  // VERIFY SOFT DELETE
  // =====================================================

  it('should not return deleted category when filtering active', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/categories')
        .query({
          isActive: true,
          search: `Minuman Updated ${timestamp}`,
        })
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(
      response.body.data.some(
        (category: { id: string }) =>
          category.id === categoryId,
      ),
    ).toBe(false);
  });
});