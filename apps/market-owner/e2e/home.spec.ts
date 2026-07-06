import { expect, test } from '@playwright/test';

test('market owner home page renders', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('DONGCHIMI Market Owner');
  await expect(page.getByRole('heading', { level: 1, name: '홈' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole('complementary', { name: '사장님웹 주요 메뉴' })).toBeVisible();
  await expect(page.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
});
