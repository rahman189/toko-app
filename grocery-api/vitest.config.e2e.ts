import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    include: [
      'test/e2e/**/*.e2e-spec.ts',
    ],

    testTimeout: 30_000,
    hookTimeout: 30_000,

    setupFiles: [
      './test/e2e/setup.ts',
    ],
  },

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url),
      ),
    },
  },
});