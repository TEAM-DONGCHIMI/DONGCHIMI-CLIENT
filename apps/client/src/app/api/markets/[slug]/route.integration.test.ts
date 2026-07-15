import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '@/domains/market/api/market-detail-api.mock';
import { server } from '@/test';
import { GET } from './route';

const API_BASE_URL = 'https://api.test';
const MARKET_SLUG = 'mangwon-fresh';

const createRouteContext = (slug: string) => ({
  params: Promise.resolve({ slug }),
});

describe('GET /api/markets/[slug]', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('마트 slug로 백엔드 상세 정보를 조회해 전달한다', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}${API_ENDPOINTS.user.markets.detail(MARKET_SLUG)}`,
        ({ request }) => {
          expect(request.headers.get('Accept')).toBe('application/json');
          expect(request.headers.get('Authorization')).toBeNull();

          return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
        },
      ),
    );

    const response = await GET(
      new Request(`${window.location.origin}/api/markets/${MARKET_SLUG}`),
      createRouteContext(MARKET_SLUG),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(MARKET_DETAIL_API_RESPONSE_FIXTURE);
  });

  it('백엔드 오류 status와 body를 browser에 전달한다', async () => {
    server.use(
      http.get(`${API_BASE_URL}${API_ENDPOINTS.user.markets.detail(MARKET_SLUG)}`, () => {
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
      new Request(`${window.location.origin}/api/markets/${MARKET_SLUG}`),
      createRouteContext(MARKET_SLUG),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      code: 'MARKET_NOT_FOUND',
      success: false,
    });
  });
});
