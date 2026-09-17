import dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined for E2E tests',
  );
}

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not defined for E2E tests',
  );
}