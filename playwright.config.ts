import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

const clientBaseURL = 'http://127.0.0.1:3000';
const marketOwnerBaseURL = 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: '.',
  testMatch: ['apps/*/e2e/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'client-chromium',
      testMatch: /apps\/client\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: clientBaseURL },
    },
    {
      name: 'market-owner-chromium',
      testMatch: /apps\/market-owner\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: marketOwnerBaseURL },
    },
    {
      name: 'client-firefox',
      testMatch: /apps\/client\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], baseURL: clientBaseURL },
    },
    {
      name: 'market-owner-firefox',
      testMatch: /apps\/market-owner\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], baseURL: marketOwnerBaseURL },
    },
    {
      name: 'client-webkit',
      testMatch: /apps\/client\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'], baseURL: clientBaseURL },
    },
    {
      name: 'market-owner-webkit',
      testMatch: /apps\/market-owner\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'], baseURL: marketOwnerBaseURL },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter client exec next dev --webpack --port 3000 --hostname 127.0.0.1',
      url: clientBaseURL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter market-owner exec vite --host 127.0.0.1 --port 5173 --strictPort',
      env: {
        VITE_PUBLIC_API_SERVER_BASE_URL: marketOwnerBaseURL,
      },
      url: marketOwnerBaseURL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],
});
