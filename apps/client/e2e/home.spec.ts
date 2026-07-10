import { expect, test } from '@playwright/test';

const routeShellTimeout = 30_000;
const marketProductsPath = '/markets/mangwon-fresh';
const productDetailPath = `${marketProductsPath}/products/samgyeopsal-500g`;

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

  await expect(page.getByRole('heading', { name: '내 주변 마트' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(page.getByRole('link', { name: '망원 신선마트 전단 보기' })).toHaveAttribute(
    'href',
    marketProductsPath,
  );
});

test('client market products route shell renders', async ({ page }) => {
  await page.goto(marketProductsPath);
  await expect(page.getByRole('heading', { name: '마트 전단 상품' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(page.getByRole('link', { name: '삼겹살 500g 상세 보기' })).toHaveAttribute(
    'href',
    productDetailPath,
  );
});

test('client product detail route shell renders', async ({ page }) => {
  await page.goto(productDetailPath);
  await expect(page.getByRole('heading', { name: '상품 상세' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(page.getByText('상품 정보를 불러오지 못했습니다')).toBeVisible();
});
