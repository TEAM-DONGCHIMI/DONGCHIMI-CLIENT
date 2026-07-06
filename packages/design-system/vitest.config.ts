import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

const commonTestConfig = {
  environment: 'jsdom',
  passWithNoTests: true,
  setupFiles: ['./src/test/setup.ts'],
};

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [vanillaExtractPlugin()],
        test: {
          ...commonTestConfig,
          exclude: ['src/**/*.integration.test.{ts,tsx}'],
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
        },
      },
      {
        plugins: [vanillaExtractPlugin()],
        test: {
          ...commonTestConfig,
          include: ['src/**/*.integration.test.{ts,tsx}'],
          name: 'integration',
        },
      },
      {
        test: {
          environment: 'node',
          include: ['scripts/**/*.test.mjs'],
          name: 'scripts',
          passWithNoTests: true,
        },
      },
    ],
  },
});
