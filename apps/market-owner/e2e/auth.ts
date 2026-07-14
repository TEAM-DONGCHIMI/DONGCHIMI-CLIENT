import { expect, type Page } from '@playwright/test';

const OWNER_LOGIN_ENDPOINT_PATTERN = '**/v1/owners/auth/login';
const AUTH_REFRESH_ENDPOINT_PATTERN = '**/v1/auth/token/refresh';

const AUTH_SUCCESS_RESPONSE = {
  code: 'SUCCESS',
  data: {
    accessToken: 'e2e-access-token',
  },
  message: 'ok',
  success: true,
};

export const signInMarketOwner = async (page: Page) => {
  await page.route(AUTH_REFRESH_ENDPOINT_PATTERN, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: AUTH_SUCCESS_RESPONSE,
      status: 200,
    });
  });

  await page.route(OWNER_LOGIN_ENDPOINT_PATTERN, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        code: 'SUCCESS',
        data: {
          ...AUTH_SUCCESS_RESPONSE.data,
          email: 'owner@example.com',
          marketId: 1,
          marketName: 'E2E Market',
          marketThumbnailUrl: null,
          ownerId: 1,
        },
        message: 'ok',
        success: true,
      },
      status: 200,
    });
  });

  await page.goto('/login');
  await page.locator('input[type="email"]').fill('owner@example.com');
  await page.locator('input[type="password"]').fill('password123!');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() =>
      page.evaluate(() => {
        return (
          localStorage.getItem('market-owner-auth') ??
          sessionStorage.getItem('market-owner-auth') ??
          ''
        );
      }),
    )
    .toContain('"isLoggedIn":true');
};
