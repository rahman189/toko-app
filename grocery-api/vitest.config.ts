import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,

    environment: 'node',

    include: [
      'src/**/*.spec.ts',
    ],

    exclude: [
      'node_modules',
      'dist',
      'test/e2e/**',
    ],

    coverage: {
      provider: 'v8',

      reporter: [
        'text',
        'html',
      ],

      include: [
        'src/**/*.ts',
      ],

      exclude: [
        'src/main.ts',
        'src/generated/**',
        'src/**/*.module.ts',
        'src/**/*.dto.ts',
      ],
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url),
      ),
    },
  },
});