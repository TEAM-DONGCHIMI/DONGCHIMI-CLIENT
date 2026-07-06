import { expect, test } from '@playwright/test';

const routeShellTimeout = 15_000;

test('client root route redirects to login', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('DONGCHIMI Client');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: '동치미 로그인' })).toBeVisible({
    timeout: routeShellTimeout,
  });
});

test('client mobile web route shells render', async ({ page }) => {
  await page.goto('/markets');

  await expect(page.getByRole('heading', { name: '내 주변 마트' })).toBeVisible({
    timeout: routeShellTimeout,
  });

  await page.getByRole('link', { name: '망원 신선마트 전단 보기' }).click();

  await expect(page.getByRole('heading', { name: '마트 전단 상품' })).toBeVisible({
    timeout: routeShellTimeout,
  });

  await page.getByRole('link', { name: '삼겹살 500g 상세 보기' }).click();

  await expect(page.getByRole('heading', { name: '상품 상세' })).toBeVisible({
    timeout: routeShellTimeout,
  });
});
