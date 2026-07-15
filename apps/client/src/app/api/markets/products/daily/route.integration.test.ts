import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';

import { GET } from './route';

const { mockedCookies } = vi.hoisted(() => ({
  mockedCookies: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mockedCookies,
}));

const API_BASE_URL = 'https://api.test';
const BACKEND_ENDPOINT = `${API_BASE_URL}/v1/users/markets/2/products/daily`;
const DAILY_PRODUCTS_BACKEND_RESPONSE_FIXTURE = {
  code: 'SUCCESS',
  data: {
    products: [
      {
        discountRate: 10,
        discountedPrice: 4500,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 201,
        thumbnailUrl: 'https://cdn.example.com/products/201.png',
      },
    ],
    totalCount: 1,
  },
  message: '요청에 성공했습니다.',
  success: true,
} as const;

const callRoute = (marketId?: string) => {
  const requestUrl = new URL('http://localhost/api/markets/products/daily');

  if (marketId != null) {
    requestUrl.searchParams.set('marketId', marketId);
  }

  return GET(new Request(requestUrl));
};

describe('GET /api/markets/products/daily', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    mockedCookies.mockResolvedValue({
      get: (name: string) => (name === 'access_token' ? { value: 'test-access-token' } : undefined),
    });
  });

  it('server-only API_BASE_URL을 사용해 백엔드 응답을 전달한다', async () => {
    server.use(
      http.get(BACKEND_ENDPOINT, ({ request }) => {
        expect(request.headers.get('authorization')).toBe('Bearer test-access-token');

        return HttpResponse.json(DAILY_PRODUCTS_BACKEND_RESPONSE_FIXTURE);
      }),
    );

    const response = await callRoute('2');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(DAILY_PRODUCTS_BACKEND_RESPONSE_FIXTURE);
  });

  it('유효하지 않은 marketId는 백엔드로 전달하지 않는다', async () => {
    const response = await callRoute('0');

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: 'INVALID_INPUT',
      success: false,
    });
  });

  it('marketId가 없으면 백엔드로 전달하지 않는다', async () => {
    const response = await callRoute();

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: 'INVALID_INPUT',
      success: false,
    });
  });

  it('백엔드 오류 status와 body를 브라우저에 전달한다', async () => {
    server.use(
      http.get(BACKEND_ENDPOINT, () => {
        return HttpResponse.json(
          {
            code: 'MARKET_NOT_FOUND',
            message: '존재하지 않는 마트입니다.',
            success: false,
          },
          { status: 404 },
        );
      }),
    );

    const response = await callRoute('2');

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      code: 'MARKET_NOT_FOUND',
      success: false,
    });
  });
});
