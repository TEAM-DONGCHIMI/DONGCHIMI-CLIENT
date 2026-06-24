import { expect, test } from '@playwright/test';

test('market owner home page renders', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('DONGCHIMI Market Owner');
  await expect(
    page.getByRole('heading', { level: 1, name: 'DONGCHIMI Market Owner' }),
  ).toBeVisible();
});
