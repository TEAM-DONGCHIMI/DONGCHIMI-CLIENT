import { expect, test, type Page } from '@playwright/test';

import { signInMarketOwner } from './auth';

const FIXED_HEADER_LABELS = ['상품 이미지', '상품명', '판매가격', '카테고리', '할인 기간'];
const PREPARED_PRODUCT_DRAFT_ENDPOINT_PATTERN = '**/v1/owners/markets/*/products/draft**';

const PREPARED_PRODUCT_DRAFTS_RESPONSE = {
  code: 'SUCCESS',
  data: {
    failCount: 1,
    preparedProducts: [
      {
        category: null,
        discountedPrice: null,
        discountEndDate: null,
        discountStartDate: null,
        draftStatus: 'FAIL',
        failReason: '필수 정보 미입력',
        name: null,
        preparedProductId: 1,
        promotionalPhrase: null,
        thumbnailUrl: null,
      },
    ],
    successCount: 0,
    totalCount: 1,
  },
  message: 'ok',
  success: true,
};

const COMPLETED_PREPARED_PRODUCT_DRAFTS_RESPONSE = {
  ...PREPARED_PRODUCT_DRAFTS_RESPONSE,
  data: {
    failCount: 0,
    preparedProducts: [
      {
        ...PREPARED_PRODUCT_DRAFTS_RESPONSE.data.preparedProducts[0],
        category: 'SEAFOOD',
        discountedPrice: 4000,
        discountEndDate: '2026-07-21',
        discountStartDate: '2026-07-15',
        draftStatus: 'SUCCESS',
        failReason: null,
        name: '고등어',
        thumbnailUrl: 'https://static.dongchimi.kr/product.png',
      },
    ],
    successCount: 1,
    totalCount: 1,
  },
};

type PreparedProductDraftsResponseTypes =
  | typeof PREPARED_PRODUCT_DRAFTS_RESPONSE
  | typeof COMPLETED_PREPARED_PRODUCT_DRAFTS_RESPONSE;

const mockPreparedProductDrafts = async (
  page: Page,
  response: PreparedProductDraftsResponseTypes = PREPARED_PRODUCT_DRAFTS_RESPONSE,
) => {
  await page.route(PREPARED_PRODUCT_DRAFT_ENDPOINT_PATTERN, async (route) => {
    const requestMethod = route.request().method();

    if (requestMethod === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        json: response,
        status: 200,
      });
      return;
    }

    if (requestMethod === 'PUT') {
      await route.fulfill({
        contentType: 'application/json',
        json: {
          code: 'SUCCESS',
          message: 'ok',
          success: true,
        },
        status: 200,
      });
      return;
    }

    await route.fallback();
  });
};

test.beforeEach(async ({ page }) => {
  await mockPreparedProductDrafts(page);
});

const getTableHeader = (page: Page) => {
  return page
    .getByRole('checkbox', { name: '현재 페이지 상품 전체 선택' })
    .locator('..')
    .locator('..');
};

const getHeaderCellWidths = async (page: Page) => {
  const tableHeader = getTableHeader(page);

  return Promise.all(
    FIXED_HEADER_LABELS.map((label) =>
      tableHeader
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
  await signInMarketOwner(page);
  await page.goto('/products/registration-result');

  await expect(page.getByRole('heading', { name: '상품 등록 결과 확인' })).toBeVisible();

  const desktopHeaderCellWidths = await getHeaderCellWidths(page);
  const tableHeader = getTableHeader(page);
  const table = tableHeader.locator('..');
  const tableScroll = table.locator('..');
  const sortButton = page.getByRole('button', { name: '정렬' });
  const sortTrailingIcon = sortButton.locator('span').last();

  await expect(tableHeader).toHaveCSS('border-top-right-radius', '12px');
  await expect(sortTrailingIcon).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await sortButton.click();
  await expect(sortButton).toHaveAttribute('aria-expanded', 'true');
  await expect(sortTrailingIcon).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
  await sortButton.click();
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

test('empty needs-edit segment keeps four blank rows and shows the completed status chip', async ({
  page,
}) => {
  await page.unroute(PREPARED_PRODUCT_DRAFT_ENDPOINT_PATTERN);
  await mockPreparedProductDrafts(page, COMPLETED_PREPARED_PRODUCT_DRAFTS_RESPONSE);
  await signInMarketOwner(page);
  await page.goto('/products/registration-result');

  await expect(page.getByRole('button', { name: '수정 필요 0' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  const emptyProductRows = page
    .getByLabel('수정 필요 상품 목록')
    .locator(':scope > [aria-hidden="true"]');

  await expect(emptyProductRows).toHaveCount(4);
  expect(
    await emptyProductRows.evaluateAll((rows) =>
      rows.map((row) => row.getBoundingClientRect().height),
    ),
  ).toEqual([98, 98, 98, 98]);

  const completedStatusText = page.getByText('모든 상품의 확인이 완료되었어요', {
    exact: true,
  });
  const completedStatusChip = completedStatusText.locator('..');

  await expect(completedStatusChip).toHaveCSS('background-color', 'rgb(230, 250, 242)');
  await expect(completedStatusText).toHaveCSS('color', 'rgb(21, 196, 126)');
});

test('registration result fields normalize input and expose validation messages', async ({
  page,
}) => {
  await signInMarketOwner(page);
  await page.goto('/products/registration-result');

  const productNameInput = page.getByPlaceholder('제품명을 입력하세요').first();
  const priceInput = page.getByPlaceholder('가격을 입력하세요').first();
  const promotionTextInput = page.getByPlaceholder('홍보문구를 입력하세요').first();
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

  await priceInput.fill('10000000');

  const priceMaximumError = page.getByText('9,999,999원 이하로 입력해 주세요.');

  await expect(priceMaximumError).toBeVisible();
  await expect(priceMaximumError).toHaveCSS('white-space', 'nowrap');

  await priceInput.fill('9999999');
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
