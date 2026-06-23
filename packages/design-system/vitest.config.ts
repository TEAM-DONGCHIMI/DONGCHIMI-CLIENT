import { defineConfig } from 'vitest/config';

const commonTestConfig = {
  environment: 'jsdom',
  passWithNoTests: true,
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
