import { expect, test } from '@playwright/test';

import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '../src/domains/market/api/market-detail-api.mock';

const routeShellTimeout = 30_000;
const marketProductsPath = '/markets/mangwon-fresh';
const productDetailPath = `${marketProductsPath}/products/101`;

test('client root route redirects to login', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('DONGCHIMI Client');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: '동치미 로그인' })).toBeVisible({
    timeout: routeShellTimeout,
  });
});

test('client market list route shell renders', async ({ page }) => {
  await page.goto('/markets');

  await expect(
    page.getByRole('heading', { name: '현재 위치를 기준으로 가까운 마트를 보여드릴게요' }),
  ).toBeVisible({ timeout: routeShellTimeout });
  await expect(page.getByRole('searchbox', { name: '위치 또는 마트 검색' })).toBeVisible();
  await expect(page.getByRole('region', { name: '지도 영역' })).toBeVisible();
  await expect(page.getByRole('region', { name: '주변 마트 목록' })).toBeVisible();
});

test('client market products route shell renders', async ({ page }) => {
  await page.route('**/v1/users/markets/mangwon-fresh', (route) => {
    return route.fulfill({
      contentType: 'application/json',
      json: MARKET_DETAIL_API_RESPONSE_FIXTURE,
    });
  });

  await page.goto(marketProductsPath);
  await expect(page.getByRole('heading', { name: '전단보기' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(
    page.getByRole('heading', { name: MARKET_DETAIL_API_RESPONSE_FIXTURE.data.name }),
  ).toBeVisible();
});

test('client product detail route shell renders', async ({ page }) => {
  await page.goto(productDetailPath);
  await expect(page.getByRole('heading', { name: '오늘의 특가' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(page.getByRole('heading', { name: '삼겹살 500g' })).toBeVisible();
  await expect(page.getByText('4,500원')).toBeVisible();
});
