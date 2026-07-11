import { expect, test } from '@playwright/test';

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
  await expect(page.getByRole('heading', { name: '전단보기' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(
    page.getByRole('link', { name: '삼겹살 500g 6,900원 상품 보기' }).first(),
  ).toHaveAttribute('href', productDetailPath);
});

test('client product detail route shell renders', async ({ page }) => {
  await page.goto(productDetailPath);
  await expect(page.getByRole('heading', { name: '오늘의 특가' })).toBeVisible({
    timeout: routeShellTimeout,
  });
  await expect(page.getByRole('heading', { name: '삼겹살 500g' })).toBeVisible();
  await expect(page.getByText('4,500원')).toBeVisible();
});
