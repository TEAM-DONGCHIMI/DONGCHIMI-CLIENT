import { expect, test } from '@playwright/test';

test('client home page renders', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('DONGCHIMI Client');
  await expect(page.getByText('DONGCHIMI CLIENT')).toBeVisible();
});
