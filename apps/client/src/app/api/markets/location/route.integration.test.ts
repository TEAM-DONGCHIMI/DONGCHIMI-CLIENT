import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { GET } from './route';

const { cookies } = vi.hoisted(() => ({
  cookies: vi.fn(),
}));

vi.mock('next/headers', () => ({ cookies }));

const API_BASE_URL = 'https://api.test';
const KAKAO_LOGIN_ACCESS_TOKEN = 'kakao-login-access-token';
const LOCATION_SEARCH_PARAMS = {
  lat: 37.5651,
  lng: 126.9895,
  radius: 1000,
  size: 5,
};
const LOCATION_ENDPOINT = API_ENDPOINTS.user.markets.location(LOCATION_SEARCH_PARAMS);

describe('GET /api/markets/location', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  beforeEach(() => {
    cookies.mockResolvedValue({
      get: (name: string) =>
        name === 'access_token' ? { value: KAKAO_LOGIN_ACCESS_TOKEN } : undefined,
    });
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('forwards the Kakao login access token cookie to the location API', async () => {
    server.use(
      http.get(`${API_BASE_URL}${LOCATION_ENDPOINT}`, ({ request }) => {
        expect(request.headers.get('Accept')).toBe('application/json');
        expect(request.headers.get('Authorization')).toBe(`Bearer ${KAKAO_LOGIN_ACCESS_TOKEN}`);

        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: {
            hasNext: false,
            nextCursor: null,
            contents: [],
          },
        });
      }),
    );

    const response = await GET(
      new Request(
        `${window.location.origin}/api/markets/location?${new URLSearchParams(
          Object.entries(LOCATION_SEARCH_PARAMS).map(([key, value]) => [key, String(value)]),
        )}`,
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        contents: [],
      },
    });
  });

  it('returns 400 when coordinates are missing', async () => {
    const response = await GET(new Request(`${window.location.origin}/api/markets/location`));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: 'INVALID_INPUT',
      success: false,
    });
  });
});
