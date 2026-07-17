import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { POST } from './route';

const API_BASE_URL = 'https://api.test';
const OAUTH_STATE = 'oauth-state';
const RETURN_TO = '/markets/mangwon-fresh/products/402?tab=detail';

interface CreateLoginRequestOptions {
  body?: unknown;
  cookieState?: string | null;
  returnTo?: string | null;
}

const createLoginRequest = ({
  body = { code: 'authorization-code', state: OAUTH_STATE },
  cookieState = OAUTH_STATE,
  returnTo = RETURN_TO,
}: CreateLoginRequestOptions = {}) => {
  const cookies = [
    ...(cookieState === null ? [] : [`kakao_oauth_state=${cookieState}`]),
    ...(returnTo === null ? [] : [`kakao_oauth_return_to=${encodeURIComponent(returnTo)}`]),
  ];

  return new Request('http://localhost/api/auth/kakao/login', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(cookies.length === 0 ? {} : { Cookie: cookies.join('; ') }),
    },
    method: 'POST',
  });
};

const expectOAuthCookiesToBeDeleted = (response: Response) => {
  expect(response.headers.getSetCookie()).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/kakao_oauth_state=;.*Max-Age=0/),
      expect.stringMatching(/kakao_oauth_return_to=;.*Max-Age=0/),
    ]),
  );
};

describe('POST /api/auth/kakao/login', () => {
  beforeAll(() => {
    vi.stubEnv('API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('백엔드 token을 response body에서 제거하고 HttpOnly cookie로 전달한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, async ({ request }) => {
        await expect(request.json()).resolves.toEqual({ code: 'authorization-code' });

        return HttpResponse.json(
          {
            code: 'SUCCESS',
            data: { accessToken: 'access-token' },
            message: '요청에 성공했습니다.',
            success: true,
          },
          {
            headers: {
              'Set-Cookie':
                'refreshToken=refresh-token; HttpOnly; Secure; SameSite=Lax; Path=/v1/auth/token/refresh',
            },
          },
        );
      }),
    );

    const response = await POST(createLoginRequest());

    await expect(response.json()).resolves.toEqual({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      redirectTo: RETURN_TO,
      success: true,
    });

    const setCookieHeaders = response.headers.getSetCookie();

    expect(setCookieHeaders).toEqual(
      expect.arrayContaining([
        expect.stringContaining('access_token=access-token'),
        expect.stringContaining('refreshToken=refresh-token'),
      ]),
    );
    expect(setCookieHeaders.join(';')).toContain('Path=/api/auth/token/refresh');
    expect(setCookieHeaders.join(';')).toContain('HttpOnly');
    expectOAuthCookiesToBeDeleted(response);
  });

  it('백엔드가 refresh cookie를 주지 않아도 access token으로 로그인을 완료한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: { accessToken: 'access-token' },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const response = await POST(createLoginRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      redirectTo: RETURN_TO,
      success: true,
    });
    expect(response.headers.getSetCookie()).toEqual(
      expect.arrayContaining([expect.stringContaining('access_token=access-token')]),
    );
    expectOAuthCookiesToBeDeleted(response);
  });

  it.each([
    [null],
    ['https://evil.example/markets'],
    ['//evil.example/markets'],
    ['/login'],
    ['/markets-evil'],
  ])('returnTo cookie %s가 없거나 안전하지 않으면 /markets를 반환한다', async (returnTo) => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: { accessToken: 'access-token' },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const response = await POST(createLoginRequest({ returnTo }));

    await expect(response.json()).resolves.toMatchObject({
      redirectTo: '/markets',
      success: true,
    });
    expectOAuthCookiesToBeDeleted(response);
  });

  it('decode할 수 없는 raw returnTo cookie는 /markets로 fallback한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          data: { accessToken: 'access-token' },
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const request = createLoginRequest({ returnTo: null });
    request.headers.set(
      'Cookie',
      `${request.headers.get('Cookie')}; kakao_oauth_return_to=%E0%A4%A`,
    );

    const response = await POST(request);

    await expect(response.json()).resolves.toMatchObject({
      redirectTo: '/markets',
      success: true,
    });
    expectOAuthCookiesToBeDeleted(response);
  });

  it.each([[{ code: '', state: OAUTH_STATE }], [{ code: 'authorization-code', state: '' }]])(
    '빈 code/state를 백엔드로 전달하지 않는다',
    async (body) => {
      const response = await POST(createLoginRequest({ body }));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        code: 'INVALID_INPUT',
        success: false,
      });
      expectOAuthCookiesToBeDeleted(response);
    },
  );

  it.each([
    [null, OAUTH_STATE],
    ['different-state', OAUTH_STATE],
  ])(
    'state cookie가 없거나 callback과 다르면 백엔드를 호출하지 않는다',
    async (cookieState, state) => {
      const response = await POST(
        createLoginRequest({ body: { code: 'authorization-code', state }, cookieState }),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        code: 'OAUTH_STATE_INVALID',
        success: false,
      });
      expectOAuthCookiesToBeDeleted(response);
    },
  );

  it.each([
    [400, 'UNSUPPORTED_OAUTH_PROVIDER', '지원하지 않는 소셜 로그인 제공자입니다.'],
    [401, 'OAUTH_AUTHENTICATION_FAILED', '소셜 로그인 인증에 실패했습니다.'],
    [503, 'SERVICE_UNAVAILABLE', '현재 로그인 서비스를 사용할 수 없습니다.'],
  ])('백엔드 %i %s 오류를 그대로 전달한다', async (status, code, message) => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => {
        return HttpResponse.json({ code, message, success: false }, { status });
      }),
    );

    const response = await POST(createLoginRequest());

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ code, message, success: false });
    expectOAuthCookiesToBeDeleted(response);
  });

  it('API_BASE_URL 설정 오류를 upstream 연결 실패로 오인하지 않는다', async () => {
    vi.stubEnv('API_BASE_URL', '');

    try {
      const response = await POST(createLoginRequest());

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        code: 'OAUTH_CONFIGURATION_ERROR',
        message: '로그인 서버 설정을 확인할 수 없습니다.',
        success: false,
      });
      expectOAuthCookiesToBeDeleted(response);
    } finally {
      vi.stubEnv('API_BASE_URL', API_BASE_URL);
    }
  });

  it('백엔드 네트워크 실패만 502 OAUTH_UPSTREAM_FAILED로 응답한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => HttpResponse.error()),
    );

    const response = await POST(createLoginRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      code: 'OAUTH_UPSTREAM_FAILED',
      message: '로그인 서버 연결에 실패했습니다.',
      success: false,
    });
    expectOAuthCookiesToBeDeleted(response);
  });

  it.each([
    ['JSON이 아닌 응답', () => new HttpResponse('Bad Gateway', { status: 502 })],
    ['계약과 다른 JSON 응답', () => HttpResponse.json({ success: false }, { status: 502 })],
  ])('%s은 502 OAUTH_UPSTREAM_INVALID_RESPONSE로 응답한다', async (_, createResponse) => {
    server.use(http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => createResponse()));

    const response = await POST(createLoginRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      code: 'OAUTH_UPSTREAM_INVALID_RESPONSE',
      message: '로그인 서버 응답을 확인할 수 없습니다.',
      success: false,
    });
    expectOAuthCookiesToBeDeleted(response);
  });

  it('성공 응답에 access token이 없으면 502를 반환한다', async () => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => {
        return HttpResponse.json({
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          success: true,
        });
      }),
    );

    const response = await POST(createLoginRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      code: 'OAUTH_TOKEN_MISSING',
      success: false,
    });
    expectOAuthCookiesToBeDeleted(response);
  });
});
