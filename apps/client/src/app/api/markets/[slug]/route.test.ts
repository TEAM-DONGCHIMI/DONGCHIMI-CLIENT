import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MARKET_DETAIL_API_RESPONSE_FIXTURE } from '@/domains/market/api/market-detail-api.mock';
import { server } from '@/test';

import { GET } from './route';

const API_BASE_URL = 'https://api.test';

const getRouteResponse = () => {
  return GET(new Request('http://localhost/api/markets/mangwon-fresh'), {
    params: Promise.resolve({ slug: 'mangwon-fresh' }),
  });
};

describe('GET /api/markets/[slug]', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('development 환경에서만 server token을 배포 API 요청에 전달한다', async () => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
    vi.stubEnv('DEV_ACCESS_TOKEN', 'temporary-access-token');
    vi.stubEnv('NODE_ENV', 'development');
    server.use(
      http.get(`${API_BASE_URL}/v1/users/markets/:slug`, ({ params, request }) => {
        expect(params.slug).toBe('mangwon-fresh');
        expect(request.headers.get('Authorization')).toBe('Bearer temporary-access-token');

        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    const response = await getRouteResponse();

    await expect(response.json()).resolves.toEqual(MARKET_DETAIL_API_RESPONSE_FIXTURE);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('production 환경에서는 development token을 배포 API에 전달하지 않는다', async () => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
    vi.stubEnv('DEV_ACCESS_TOKEN', 'temporary-access-token');
    vi.stubEnv('NODE_ENV', 'production');
    server.use(
      http.get(`${API_BASE_URL}/v1/users/markets/:slug`, ({ request }) => {
        expect(request.headers.get('Authorization')).toBeNull();

        return HttpResponse.json(MARKET_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    const response = await getRouteResponse();

    await expect(response.json()).resolves.toEqual(MARKET_DETAIL_API_RESPONSE_FIXTURE);
  });

  it('API base URL이 없으면 configuration error를 반환한다', async () => {
    vi.stubEnv('API_BASE_URL', '');

    const response = await getRouteResponse();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      code: 'API_PROXY_ERROR',
      success: false,
    });
  });

  it('upstream이 JSON이 아닌 응답을 반환하면 bad gateway error를 반환한다', async () => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
    server.use(
      http.get(`${API_BASE_URL}/v1/users/markets/:slug`, () => {
        return new HttpResponse('<html>not an API response</html>', {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }),
    );

    const response = await getRouteResponse();

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      code: 'API_PROXY_ERROR',
      success: false,
    });
  });

  it('upstream 요청이 timeout되면 bad gateway error를 반환한다', async () => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new DOMException('Timeout', 'TimeoutError'),
    );

    const response = await getRouteResponse();

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      code: 'API_PROXY_ERROR',
      success: false,
    });
  });
});
