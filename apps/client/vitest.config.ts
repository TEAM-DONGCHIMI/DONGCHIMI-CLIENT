import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const alias = {
  '@': path.resolve(dirname, './src'),
};

const commonTestConfig = {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
};

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    projects: [
      {
        resolve: {
          alias,
        },
        test: {
          ...commonTestConfig,
          exclude: ['src/**/*.integration.test.{ts,tsx}'],
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
        },
      },
      {
        resolve: {
          alias,
        },
        test: {
          ...commonTestConfig,
          include: ['src/**/*.integration.test.{ts,tsx}'],
          name: 'integration',
        },
      },
    ],
  },
});
