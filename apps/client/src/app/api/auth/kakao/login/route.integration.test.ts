import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { POST } from './route';

const API_BASE_URL = 'https://api.test';
const OAUTH_STATE = 'oauth-state';

interface CreateLoginRequestOptions {
  body?: unknown;
  cookieState?: string | null;
}

const createLoginRequest = ({
  body = { code: 'authorization-code', state: OAUTH_STATE },
  cookieState = OAUTH_STATE,
}: CreateLoginRequestOptions = {}) => {
  return new Request('http://localhost/api/auth/kakao/login', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(cookieState === null ? {} : { Cookie: `kakao_oauth_state=${cookieState}` }),
    },
    method: 'POST',
  });
};

const expectOAuthStateCookieToBeDeleted = (response: Response) => {
  expect(response.headers.getSetCookie()).toEqual(
    expect.arrayContaining([expect.stringMatching(/kakao_oauth_state=;.*Max-Age=0/)]),
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
    expectOAuthStateCookieToBeDeleted(response);
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
      expectOAuthStateCookieToBeDeleted(response);
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
      expectOAuthStateCookieToBeDeleted(response);
    },
  );

  it.each([
    [400, 'UNSUPPORTED_OAUTH_PROVIDER', '지원하지 않는 소셜 로그인 제공자입니다.'],
    [401, 'OAUTH_AUTHENTICATION_FAILED', '소셜 로그인 인증에 실패했습니다.'],
  ])('백엔드 %i %s 오류를 그대로 전달한다', async (status, code, message) => {
    server.use(
      http.post(`${API_BASE_URL}/v1/users/login/oauth2/kakao`, () => {
        return HttpResponse.json({ code, message, success: false }, { status });
      }),
    );

    const response = await POST(createLoginRequest());

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ code, message, success: false });
    expectOAuthStateCookieToBeDeleted(response);
  });

  it('성공 응답에 token이 없으면 502를 반환한다', async () => {
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
    expectOAuthStateCookieToBeDeleted(response);
  });
});
