import { expect, test } from '@playwright/test';

const marketSlug = 'scroll-restoration-market';
const marketProductsPath = `/markets/${marketSlug}`;
const clientOrigin = process.env.CLIENT_E2E_ORIGIN ?? '';
const availableCategories = ['VEGETABLE_FRUIT', 'MEAT_EGG', 'SEAFOOD'];
const eventProductPageSize = 12;
const lastEventProductId = 1035;

const createSuccessResponse = (data: unknown) => ({
  code: 'SUCCESS',
  data,
  message: '요청에 성공했습니다.',
  success: true,
});

const createEventProductsPage = (cursor: string | null) => {
  const startIndex = cursor == null ? 0 : Number(cursor) - 999;
  const products = Array.from({ length: eventProductPageSize }, (_, index) => {
    const productId = 1000 + startIndex + index;

    return {
      discountedPrice: 5_000 + productId,
      name: `행사상품 ${productId}`,
      productId,
      thumbnailUrl: null,
    };
  });
  const hasNext = startIndex + eventProductPageSize < 36;

  return {
    availableCategories,
    content: products,
    hasNext,
    nextCursor: hasNext ? products.at(-1)?.productId : null,
  };
};

test('행사 할인 무한 목록의 category, pages, 상품 상대 위치를 뒤로가기에서 복원한다', async ({
  page,
}) => {
  let periodicRequestCount = 0;

  await page.setViewportSize({ height: 844, width: 390 });
  await page.route(`**/api/markets/${marketSlug}`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: createSuccessResponse({
        address: '서울 마포구 월드컵로 13길 1',
        businessHours: [],
        isHolidayClosed: false,
        isOpenNow: true,
        marketId: 1,
        marketPhone1: '02-123-4567',
        marketPhone2: null,
        name: '스크롤 복원 마트',
        ownerPhone: '010-1234-5678',
        thumbnailUrl: null,
        top3: [],
      }),
      status: 200,
    });
  });
  await page.route('**/api/markets/products/daily?*', async (route) => {
    const products = Array.from({ length: 4 }, (_, index) => ({
      discountRate: 10,
      discountedPrice: 4_500 + index,
      name: `오늘의 특가 ${index + 1}`,
      originalPrice: 5_000 + index,
      productId: 200 + index,
      thumbnailUrl: null,
    }));

    await route.fulfill({
      contentType: 'application/json',
      json: createSuccessResponse({ products, totalCount: products.length }),
      status: 200,
    });
  });
  await page.route('**/api/markets/products/periodic?*', async (route) => {
    const requestUrl = new URL(route.request().url());
    const category = requestUrl.searchParams.get('category');
    const cursor = requestUrl.searchParams.get('cursor');

    periodicRequestCount += 1;
    await route.fulfill({
      contentType: 'application/json',
      json: createSuccessResponse(
        category === 'MEAT_EGG'
          ? createEventProductsPage(cursor)
          : {
              availableCategories,
              content: [
                {
                  discountedPrice: 4_900,
                  name: '전체 행사상품',
                  productId: 900,
                  thumbnailUrl: null,
                },
              ],
              hasNext: false,
              nextCursor: null,
            },
      ),
      status: 200,
    });
  });
  await page.route('**/api/products/*?marketId=1', async (route) => {
    const requestUrl = new URL(route.request().url());
    const productId = Number(requestUrl.pathname.split('/').at(-1));

    await route.fulfill({
      contentType: 'application/json',
      json: createSuccessResponse({
        dealType: 'PERIODIC',
        discountedPrice: 5_000 + productId,
        discountEndDate: '2026-07-31',
        discountRate: 10,
        discountStartDate: '2026-07-01',
        marketName: '스크롤 복원 마트',
        name: `행사상품 ${productId}`,
        originalPrice: 7_000 + productId,
        productId,
        promotionalPhrase: null,
        thumbnailUrl: null,
      }),
      status: 200,
    });
  });

  await page.goto(`${clientOrigin}${marketProductsPath}`);
  await expect(page.getByRole('heading', { name: '스크롤 복원 마트' })).toBeVisible({
    timeout: 15_000,
  });

  const meatCategoryButton = page.getByRole('button', { name: '정육·달걀' });

  await expect(meatCategoryButton).toBeVisible();
  await meatCategoryButton.click();
  await expect(page.getByRole('link', { name: '행사상품 1000 상품 보기' })).toBeVisible();

  await page.getByRole('link', { name: '행사상품 1011 상품 보기' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: '행사상품 1012 상품 보기' })).toBeAttached();
  await page.getByRole('link', { name: '행사상품 1023 상품 보기' }).scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('link', { name: `행사상품 ${lastEventProductId} 상품 보기` }),
  ).toBeAttached();

  const targetProduct = page.getByRole('link', {
    name: `행사상품 ${lastEventProductId} 상품 보기`,
  });

  await targetProduct.scrollIntoViewIfNeeded();

  const scrollContractBeforeNavigation = await page.evaluate(() => ({
    bodyScrollTop: document.body.scrollTop,
    scrollY: window.scrollY,
    usesDocumentScrollingElement: document.scrollingElement === document.documentElement,
  }));
  const viewportTopBeforeNavigation = await targetProduct.evaluate((element) => {
    return element.getBoundingClientRect().top;
  });
  const periodicRequestCountBeforeNavigation = periodicRequestCount;

  expect(scrollContractBeforeNavigation).toMatchObject({
    bodyScrollTop: 0,
    usesDocumentScrollingElement: true,
  });
  expect(scrollContractBeforeNavigation.scrollY).toBeGreaterThan(0);

  await targetProduct.click();
  await expect(page).toHaveURL(
    `${clientOrigin}${marketProductsPath}/products/${lastEventProductId}`,
  );
  await expect(page.getByRole('heading', { name: `행사상품 ${lastEventProductId}` })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(`${clientOrigin}${marketProductsPath}`);
  await expect(targetProduct).toBeAttached();

  await expect
    .poll(async () => {
      const restoredAnchorTop = await targetProduct.evaluate((element) => {
        return element.getBoundingClientRect().top;
      });

      return Math.abs(restoredAnchorTop - viewportTopBeforeNavigation);
    })
    .toBeLessThanOrEqual(2);

  await expect(meatCategoryButton).toHaveAttribute('aria-pressed', 'true');
  expect(periodicRequestCount).toBe(periodicRequestCountBeforeNavigation);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
