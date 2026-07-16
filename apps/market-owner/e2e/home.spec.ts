import { expect, test } from '@playwright/test';

import { signInMarketOwner } from './auth';

test('market owner home page renders', async ({ page }) => {
  await signInMarketOwner(page);

  await expect(page).toHaveTitle('동치미 | 마트 관리자');
  await expect(page.getByRole('heading', { level: 1, name: '홈' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole('complementary', { name: '사장님웹 주요 메뉴' })).toBeVisible();
  await expect(page.getByRole('link', { exact: true, name: '홈' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});
