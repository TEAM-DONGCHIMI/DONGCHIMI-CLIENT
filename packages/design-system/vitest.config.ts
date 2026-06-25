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
        test: {
          ...commonTestConfig,
          exclude: ['src/**/*.integration.test.{ts,tsx}'],
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
        },
      },
      {
        test: {
          ...commonTestConfig,
          include: ['src/**/*.integration.test.{ts,tsx}'],
          name: 'integration',
        },
      },
    ],
  },
});
