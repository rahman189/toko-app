import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { createTestApp } from './test-app.js';

describe('Auth E2E', () => {
  let app: INestApplication;

  let accessToken: string;

  const user = {
    name: 'E2E Test User',
    email: `e2e-${Date.now()}@example.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register - should register user', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/auth/register')
      .send(user)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', user.email);

    expect(response.body).not.toHaveProperty(
      'password',
    );
  });

  it('POST /auth/login - should login user', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty(
      'accessToken',
    );

    accessToken = response.body.accessToken;

    expect(accessToken).toBeTypeOf('string');
  });

  it('GET /auth/me - should return authenticated user', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get('/auth/me')
      .set(
        'Authorization',
        `Bearer ${accessToken}`,
      )
      .expect(200);

    expect(response.body).toHaveProperty(
      'email',
      user.email,
    );

    expect(response.body).not.toHaveProperty(
      'password',
    );
  });

  it('GET /auth/me - should reject unauthenticated request', async () => {
    await request(
      app.getHttpServer(),
    )
      .get('/auth/me')
      .expect(401);
  });
});