import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const commonTestConfig = {
  environment: 'jsdom',
  passWithNoTests: true,
  setupFiles: ['./src/test/setup.ts'],
};

const appResolveConfig = {
  alias: {
    '@': path.resolve(dirname, './src'),
  },
};

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [vanillaExtractPlugin()],
        resolve: appResolveConfig,
        test: {
          ...commonTestConfig,
          exclude: ['src/**/*.integration.test.{ts,tsx}'],
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
        },
      },
      {
        plugins: [vanillaExtractPlugin()],
        resolve: appResolveConfig,
        test: {
          ...commonTestConfig,
          include: ['src/**/*.integration.test.{ts,tsx}'],
          name: 'integration',
        },
      },
    ],
  },
});
