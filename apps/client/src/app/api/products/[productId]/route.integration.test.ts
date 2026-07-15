import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { PRODUCT_DETAIL_API_RESPONSE_FIXTURE } from '@/domains/market/api/product-detail-api.mock';
import { server } from '@/test';
import { GET } from './route';

const { cookies } = vi.hoisted(() => ({
  cookies: vi.fn(),
}));

vi.mock('next/headers', () => ({ cookies }));

const API_BASE_URL = 'https://api.test';
const MARKET_ID = 1;
const PRODUCT_ID = 10;
const TEST_USER_ACCESS_TOKEN = 'test-user-access-token';

const createRouteContext = (productId: string) => ({
  params: Promise.resolve({ productId }),
});

const createRequest = (marketId?: string | number) => {
  const url = new URL(`${window.location.origin}/api/products/${PRODUCT_ID}`);

  if (marketId != null) {
    url.searchParams.set('marketId', String(marketId));
  }

  return new Request(url);
};

describe('GET /api/products/[productId]', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  beforeEach(() => {
    cookies.mockResolvedValue({
      get: (name: string) =>
        name === 'access_token' ? { value: TEST_USER_ACCESS_TOKEN } : undefined,
    });
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('숫자 marketId와 productId로 백엔드 상품 상세를 조회해 전달한다', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}${API_ENDPOINTS.user.products.detail(MARKET_ID, PRODUCT_ID)}`,
        ({ request }) => {
          expect(request.headers.get('Accept')).toBe('application/json');
          expect(request.headers.get('Authorization')).toBe(`Bearer ${TEST_USER_ACCESS_TOKEN}`);

          return HttpResponse.json(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
        },
      ),
    );

    const response = await GET(createRequest(MARKET_ID), createRouteContext(String(PRODUCT_ID)));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
  });

  it('백엔드 오류 status와 body를 browser에 전달한다', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}${API_ENDPOINTS.user.products.detail(MARKET_ID, PRODUCT_ID)}`,
        () => {
          return HttpResponse.json(
            {
              code: 'PRODUCT_NOT_FOUND',
              message: '존재하지 않는 상품입니다.',
              success: false,
            },
            { status: 404 },
          );
        },
      ),
    );

    const response = await GET(createRequest(MARKET_ID), createRouteContext(String(PRODUCT_ID)));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      code: 'PRODUCT_NOT_FOUND',
      success: false,
    });
  });

  it.each([
    { marketId: undefined, productId: String(PRODUCT_ID) },
    { marketId: 'market-1', productId: String(PRODUCT_ID) },
    { marketId: MARKET_ID, productId: 'product-10' },
  ])('잘못된 식별자는 upstream 요청 전에 거절한다: %o', async ({ marketId, productId }) => {
    const response = await GET(createRequest(marketId), createRouteContext(productId));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: 'INVALID_INPUT',
      success: false,
    });
  });
});
