import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';

import { getDailyProducts } from './daily-products-api';
import { DAILY_PRODUCTS_API_RESPONSE_FIXTURE } from './daily-products-api.mock';

const DAILY_PRODUCTS_ENDPOINT = `${window.location.origin}/api/markets/2/products/daily`;

describe('getDailyProducts', () => {
  it('marketId path parameter로 오늘의 특가 목록을 조회한다', async () => {
    server.use(
      http.get(DAILY_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json(DAILY_PRODUCTS_API_RESPONSE_FIXTURE);
      }),
    );

    await expect(getDailyProducts({ marketId: 2 })).resolves.toEqual(
      DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data,
    );
  });

  it('빈 목록을 정상 success data로 반환한다', async () => {
    server.use(
      http.get(DAILY_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json({
          ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE,
          data: { products: [], totalCount: 0 },
        });
      }),
    );

    await expect(getDailyProducts({ marketId: 2 })).resolves.toEqual({
      products: [],
      totalCount: 0,
    });
  });

  it('누락된 thumbnailUrl을 null로 정규화한다', async () => {
    const productWithoutThumbnail = {
      ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products[0],
      thumbnailUrl: undefined,
    };

    server.use(
      http.get(DAILY_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json({
          ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE,
          data: {
            products: [productWithoutThumbnail],
            totalCount: 1,
          },
        });
      }),
    );

    await expect(getDailyProducts({ marketId: 2 })).resolves.toMatchObject({
      products: [{ thumbnailUrl: null }],
    });
  });

  it('계약과 다른 응답은 validation error로 노출한다', async () => {
    server.use(
      http.get(DAILY_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json({
          ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE,
          data: {
            products: [
              {
                ...DAILY_PRODUCTS_API_RESPONSE_FIXTURE.data.products[0],
                discountedPrice: '4500',
              },
            ],
            totalCount: 1,
          },
        });
      }),
    );

    await expect(getDailyProducts({ marketId: 2 })).rejects.toMatchObject({
      name: 'ApiResponseValidationError',
      type: 'validation',
    });
  });

  it('유효하지 않은 marketId는 요청 전에 validation error로 노출한다', async () => {
    await expect(getDailyProducts({ marketId: 0 })).rejects.toMatchObject({
      name: 'ZodError',
    });
  });

  it('BFF 오류를 삼키지 않고 API error로 노출한다', async () => {
    server.use(
      http.get(DAILY_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json(
          {
            code: 'DAILY_PRODUCTS_UNAVAILABLE',
            message: '오늘의 특가 상품을 조회할 수 없습니다.',
            success: false,
          },
          { status: 500 },
        );
      }),
    );

    await expect(getDailyProducts({ marketId: 2 })).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      type: 'server',
    });
  });
});
