import { ApiResponseValidationError } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';

import {
  PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE,
  PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE,
} from './periodic-products-api.mock';
import { getPeriodicProducts } from './periodic-products-api';

const PERIODIC_PRODUCTS_ENDPOINT = `${window.location.origin}/api/markets/products/periodic`;

describe('getPeriodicProducts', () => {
  it('marketId와 category, 기본 size로 첫 페이지를 조회한다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        expect(searchParams.get('marketId')).toBe('1');
        expect(searchParams.get('category')).toBe('MEAT_EGG');
        expect(searchParams.get('size')).toBe('12');

        return HttpResponse.json(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
      }),
    );

    await expect(getPeriodicProducts({ category: 'MEAT_EGG', marketId: 1 })).resolves.toEqual(
      PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE.data,
    );
  });

  it('다음 페이지 cursor를 query parameter로 전달한다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, ({ request }) => {
        expect(new URL(request.url).searchParams.get('cursor')).toBe('302');

        return HttpResponse.json(PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE);
      }),
    );

    await expect(getPeriodicProducts({ cursor: 302, marketId: 1 })).resolves.toEqual(
      PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE.data,
    );
  });

  it('계약과 다른 응답은 validation error로 노출한다', async () => {
    server.use(
      http.get(PERIODIC_PRODUCTS_ENDPOINT, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: { content: [{ productId: '301' }], hasNext: false, nextCursor: null },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    await expect(getPeriodicProducts({ marketId: 1 })).rejects.toThrow(ApiResponseValidationError);
  });

  it('유효하지 않은 marketId는 요청 전에 거부한다', async () => {
    await expect(getPeriodicProducts({ marketId: 0 })).rejects.toMatchObject({
      name: 'ZodError',
    });
  });

  it('서버가 지원하지 않는 category는 요청 전에 거부한다', async () => {
    await expect(
      getPeriodicProducts({ category: 'PET' as never, marketId: 1 }),
    ).rejects.toMatchObject({
      name: 'ZodError',
    });
  });
});
