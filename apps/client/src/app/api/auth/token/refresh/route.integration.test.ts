import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { POST } from './route';

const API_BASE_URL = 'https://api.test';

const createRefreshRequest = (refreshToken?: string) => {
  return new Request('http://localhost/api/auth/token/refresh', {
    headers: refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : undefined,
    method: 'POST',
  });
};

const expectAuthCookiesToBeDeleted = (response: Response) => {
  expect(response.headers.getSetCookie()).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/access_token=;.*Max-Age=0/),
      expect.stringMatching(/refreshToken=;.*Max-Age=0/),
    ]),
  );
};

describe('POST /api/auth/token/refresh', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('refresh cookie로 token을 갱신하고 새 token을 HttpOnly cookie로 전달한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/auth/token/refresh`, ({ request }) => {
        expect(request.headers.get('cookie')).toBe('refresh_token=old-refresh-token');

        return HttpResponse.json(
          {
            code: 'SUCCESS',
            data: { accessToken: 'new-access-token' },
            message: '요청에 성공했습니다.',
            success: true,
          },
          {
            headers: {
              'Set-Cookie':
                'refresh_token=new-refresh-token; HttpOnly; Secure; SameSite=Strict; Path=/v1/auth/token/refresh',
            },
          },
        );
      }),
    );

    const response = await POST(createRefreshRequest('old-refresh-token'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      success: true,
    });

    const setCookieHeaders = response.headers.getSetCookie();

    expect(setCookieHeaders).toEqual(
      expect.arrayContaining([
        expect.stringContaining('access_token=new-access-token'),
        expect.stringContaining('refreshToken=new-refresh-token'),
      ]),
    );
    expect(setCookieHeaders.join(';')).not.toContain('refresh_token=new-refresh-token');
    expect(setCookieHeaders.join(';')).toContain('Path=/api/auth/token/refresh');
    expect(setCookieHeaders.join(';')).toContain('HttpOnly');
    expect(setCookieHeaders.join(';')).toContain('SameSite=Lax');
  });

  it.each([
    [401, 'MISSING_REFRESH_TOKEN', '리프레시 토큰이 없습니다.'],
    [401, 'INVALID_REFRESH_TOKEN', '유효하지 않은 리프레시 토큰입니다.'],
  ])(
    '백엔드가 %i %s를 반환하면 오류를 전달하고 인증 cookie를 삭제한다',
    async (status, code, message) => {
      server.use(
        http.post(`${API_BASE_URL}/v1/auth/token/refresh`, () => {
          return HttpResponse.json(
            {
              code,
              message,
              success: false,
            },
            { status },
          );
        }),
      );

      const response = await POST(createRefreshRequest('expired-refresh-token'));

      expect(response.status).toBe(status);
      await expect(response.json()).resolves.toEqual({ code, message, success: false });
      expectAuthCookiesToBeDeleted(response);
    },
  );

  it('refresh cookie가 없으면 백엔드를 호출하지 않고 인증 cookie를 삭제한다', async () => {
    const response = await POST(createRefreshRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      code: 'REFRESH_TOKEN_NOT_FOUND',
      success: false,
    });
    expectAuthCookiesToBeDeleted(response);
  });

  it.each([
    [500, 'INTERNAL_SERVER_ERROR', '내부 서버 오류입니다. 다시 시도해 주세요.'],
    [503, 'SERVICE_UNAVAILABLE', '현재 토큰 갱신 서버를 사용할 수 없습니다.'],
  ])('백엔드가 일시적인 %i %s를 반환하면 인증 cookie를 유지한다', async (status, code, message) => {
    server.use(
      http.post(`${API_BASE_URL}/v1/auth/token/refresh`, () => {
        return HttpResponse.json(
          {
            code,
            message,
            success: false,
          },
          { status },
        );
      }),
    );

    const response = await POST(createRefreshRequest('refresh-token'));

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ code, message, success: false });
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it('백엔드 연결 실패는 인증 cookie를 유지한 채 502를 반환한다', async () => {
    server.use(http.post(`${API_BASE_URL}/v1/auth/token/refresh`, () => HttpResponse.error()));

    const response = await POST(createRefreshRequest('refresh-token'));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      code: 'REFRESH_UPSTREAM_FAILED',
      message: '토큰 갱신 서버 연결에 실패했습니다.',
      success: false,
    });
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it('성공 응답에 새 token이 없으면 인증 cookie를 삭제한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/auth/token/refresh`, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const response = await POST(createRefreshRequest('refresh-token'));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      code: 'REFRESH_TOKEN_RESPONSE_INVALID',
      success: false,
    });
    expectAuthCookiesToBeDeleted(response);
  });
});
