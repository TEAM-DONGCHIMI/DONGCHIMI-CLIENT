import { expect, test } from '@playwright/test';

const routeShellTimeout = 30_000;
const marketProductsPath = '/markets/mangwon-fresh';
const productDetailPath = `${marketProductsPath}/products/101`;
const productDetailViewports = [
  { height: 812, width: 375 },
  { height: 932, width: 430 },
] as const;

test('client root route redirects to login', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('동치미');
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
  await page.goto(marketProductsPath);
  await expect(page.getByRole('heading', { name: '전단보기' })).toBeVisible({
    timeout: routeShellTimeout,
  });
});

test('client product detail route shell renders', async ({ page }) => {
  await page.route('**/api/markets/mangwon-fresh', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        code: 'SUCCESS',
        data: {
          address: '서울 마포구 월드컵로 13길 1',
          businessHours: [],
          isOpenNow: true,
          marketId: 1,
          marketPhone1: '02-123-4567',
          marketPhone2: null,
          name: '망원 신선마트',
          ownerPhone: '010-1234-5678',
          thumbnailUrl: null,
          top3: [],
        },
        message: '요청에 성공했습니다.',
        success: true,
      },
      status: 200,
    });
  });
  await page.route('**/api/products/101?marketId=1', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        code: 'SUCCESS',
        data: {
          dealType: 'DAILY',
          discountedPrice: 4500,
          discountEndDate: '2026-07-16',
          discountRate: 10,
          discountStartDate: '2026-07-16',
          marketName: '망원 신선마트',
          name: '삼겹살 500g',
          originalPrice: 5000,
          productId: 101,
          promotionalPhrase: '오늘 들어온 삼겹살입니다.',
          thumbnailUrl: null,
        },
        message: '요청에 성공했습니다.',
        success: true,
      },
      status: 200,
    });
  });

  for (const viewport of productDetailViewports) {
    await page.setViewportSize(viewport);
    await page.goto(productDetailPath);

    await expect(page.getByRole('heading', { name: '오늘의 특가' })).toBeVisible({
      timeout: routeShellTimeout,
    });
    await expect(page.getByRole('heading', { name: '삼겹살 500g' })).toBeVisible();
    await expect(page.getByText('4,500원')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
