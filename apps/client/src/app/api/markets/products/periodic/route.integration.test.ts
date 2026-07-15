import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE } from '@/domains/market/api/periodic-products-api.mock';
import { server } from '@/test';
import { GET } from './route';

const { cookies } = vi.hoisted(() => ({
  cookies: vi.fn(),
}));

vi.mock('next/headers', () => ({ cookies }));

const API_BASE_URL = 'https://api.test';
const TEST_USER_ACCESS_TOKEN = 'test-user-access-token';

describe('GET /api/markets/products/periodic', () => {
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

  it('조회 조건과 access token으로 백엔드 행사 상품을 조회한다', async () => {
    const upstreamPath = API_ENDPOINTS.user.products.periodic(1, {
      category: 'MEAT_EGG',
      cursor: 302,
      size: 6,
    });

    server.use(
      http.get(`${API_BASE_URL}${upstreamPath}`, ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe(`Bearer ${TEST_USER_ACCESS_TOKEN}`);

        return HttpResponse.json(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
      }),
    );

    const response = await GET(
      new Request(
        `${window.location.origin}/api/markets/products/periodic?marketId=1&category=MEAT_EGG&cursor=302&size=6`,
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE);
  });

  it('잘못된 marketId와 category를 upstream 요청 전에 거부한다', async () => {
    const response = await GET(
      new Request(
        `${window.location.origin}/api/markets/products/periodic?marketId=0&category=PET`,
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: 'INVALID_INPUT',
      success: false,
    });
  });

  it('백엔드 오류 status와 body를 browser에 전달한다', async () => {
    server.use(
      http.get(`${API_BASE_URL}${API_ENDPOINTS.user.products.periodic(1, { size: 12 })}`, () => {
        return HttpResponse.json(
          {
            code: 'MARKET_NOT_FOUND',
            message: '마트를 찾을 수 없습니다.',
            success: false,
          },
          { status: 404 },
        );
      }),
    );

    const response = await GET(
      new Request(`${window.location.origin}/api/markets/products/periodic?marketId=1`),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      code: 'MARKET_NOT_FOUND',
      success: false,
    });
  });
});
