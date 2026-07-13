import { expect, test, type Page } from '@playwright/test';

const FIXED_HEADER_LABELS = ['상품 이미지', '상품명', '판매가격', '카테고리', '할인 기간'];

const getHeaderCellWidths = async (page: Page) => {
  return Promise.all(
    FIXED_HEADER_LABELS.map((label) =>
      page
        .getByText(label, { exact: true })
        .locator('..')
        .evaluate((element) => element.getBoundingClientRect().width),
    ),
  );
};

test('registration result table keeps fixed columns while the viewport resizes', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1600 });
  await page.goto('/products/registration-result');

  await expect(page.getByRole('heading', { name: '상품 결과 등록 확인' })).toBeVisible();

  const desktopHeaderCellWidths = await getHeaderCellWidths(page);
  const productNameHeaderCell = page.getByText('상품명', { exact: true }).locator('..');
  const tableHeader = productNameHeaderCell.locator('..');
  const table = tableHeader.locator('..');
  const tableScroll = table.locator('..');

  await expect
    .poll(() => table.evaluate((element) => element.getBoundingClientRect().width))
    .toBe(1376);

  await page.setViewportSize({ height: 900, width: 1200 });

  const narrowHeaderCellWidths = await getHeaderCellWidths(page);
  const scrollMetrics = await tableScroll.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));

  expect(narrowHeaderCellWidths).toEqual(desktopHeaderCellWidths);
  expect(scrollMetrics.scrollWidth).toBeGreaterThan(scrollMetrics.clientWidth);
});

test('registration result fields normalize input and expose validation messages', async ({
  page,
}) => {
  await page.goto('/products/registration-result');

  const productNameInput = page.getByPlaceholder('제품명을 입력하세요.').first();
  const priceInput = page.getByPlaceholder('가격을 입력하세요.').first();
  const promotionTextInput = page.getByPlaceholder('홍보문구를 입력하세요.').first();
  const discountPeriodInput = page.getByRole('textbox', { name: '상품 할인 기간 입력' }).first();

  await expect(productNameInput).not.toHaveAttribute('aria-invalid');
  await expect(priceInput).not.toHaveAttribute('aria-invalid');
  await expect(discountPeriodInput).not.toHaveAttribute('aria-invalid');
  await expect(page.getByText('상품명을 입력해주세요.')).toHaveCount(0);
  await expect(page.getByText('가격을 입력해주세요.')).toHaveCount(0);
  await expect(page.getByText('할인 기간을 입력해주세요.')).toHaveCount(0);

  await productNameInput.fill('1234567890123456');
  await expect(page.getByText('상품명은 공백 포함 15자 이하로 입력해주세요.')).toBeVisible();

  await productNameInput.fill('  수정 상품  ');
  await productNameInput.blur();
  await expect(productNameInput).toHaveValue('수정 상품');
  await expect(productNameInput).not.toHaveAttribute('aria-invalid');

  await priceInput.fill('1');
  await priceInput.fill('');

  const priceRequiredError = page.getByText('가격을 입력해주세요.');

  await expect(priceRequiredError).toBeVisible();
  await expect(priceRequiredError).toHaveCSS('white-space', 'nowrap');

  await priceInput.fill('12a,900원');
  await expect(priceInput).toHaveValue('12900');

  await priceInput.fill('100000001');

  const priceMaximumError = page.getByText('1억원 이하로 입력하세요.');

  await expect(priceMaximumError).toBeVisible();
  await expect(priceMaximumError).toHaveCSS('white-space', 'nowrap');

  await priceInput.fill('100000000');
  await expect(priceInput).not.toHaveAttribute('aria-invalid');

  await promotionTextInput.fill('1234567890123456789012345678901');
  await expect(page.getByText('홍보문구는 공백 포함 30자 이하로 입력해주세요.')).toBeVisible();

  await discountPeriodInput.fill('2026134020260720');
  await expect(page.getByText('올바른 날짜 형식으로 입력해주세요.')).toBeVisible();

  await discountPeriodInput.fill('2026072020260713');
  await expect(page.getByText('종료일은 시작일 이후 날짜를 선택해주세요.')).toBeVisible();

  await discountPeriodInput.fill('2026071320260713');
  await expect(discountPeriodInput).not.toHaveAttribute('aria-invalid');
});
