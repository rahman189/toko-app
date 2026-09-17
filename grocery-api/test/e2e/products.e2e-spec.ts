import {
  INestApplication,
} from '@nestjs/common';

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from 'vitest';

import request from 'supertest';

import { createTestApp } from './test-app.js';

describe('Products E2E', () => {
  let app: INestApplication;

  let accessToken: string;
  let categoryId: string;
  let productId: string;

  const email =
    `product-e2e-${Date.now()}@example.com`;

  beforeAll(async () => {
    app = await createTestApp();

    // register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Product E2E User',
        email,
        password: 'Password123!',
      });

    // login
    const loginResponse =
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'Password123!',
        })
        .expect(200);

    accessToken =
      loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create category', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/categories')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          name: 'Minuman',
          slug: `minuman-${Date.now()}`,
        })
        .expect(201);

    categoryId = response.body.id;

    expect(categoryId).toBeDefined();
  });

  it('should create product', async () => {
    const response =
      await request(app.getHttpServer())
        .post('/products')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          name: 'Aqua',
          brand: 'Aqua',
          description: 'Air mineral',
          categoryId,
        })
        .expect(201);

    productId = response.body.id;

    expect(response.body.name).toBe('Aqua');
  });

  it('should create product variant', async () => {
    const response =
      await request(app.getHttpServer())
        .post(`/products/${productId}/variants`)
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          variantName: 'Aqua 600ml',
          sku: `AQUA-600-${Date.now()}`,
          barcode: `899999${Date.now()}`,
          price: 5000,
          stock: 100,
          attributes: {
            volume: '600ml',
          },
        })
        .expect(201);

    expect(response.body.variantName).toBe(
      'Aqua 600ml',
    );

    expect(response.body.price).toBeDefined();
    expect(response.body.stock).toBe(100);
  });

  it('GET /products - should return products', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/products')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body).toHaveProperty(
      'data',
    );

    expect(response.body).toHaveProperty(
      'meta',
    );

    expect(
      Array.isArray(response.body.data),
    ).toBe(true);
  });

  it('GET /products - should search product', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/products')
        .query({
          search: 'Aqua',
        })
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body.data.length).toBeGreaterThan(
      0,
    );

    expect(response.body.data[0].name).toBe(
      'Aqua',
    );
  });

  it('GET /products - should filter by price', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/products')
        .query({
          minPrice: 4000,
          maxPrice: 6000,
        })
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .expect(200);

    expect(response.body).toHaveProperty(
      'data',
    );
  });

  it('GET /products - should paginate', async () => {
    const response =
      await request(app.getHttpServer())
        .get('/products')
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
  });
});