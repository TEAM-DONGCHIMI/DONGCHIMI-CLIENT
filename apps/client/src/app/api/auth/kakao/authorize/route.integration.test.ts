import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

const KAKAO_REST_API_KEY = 'kakao-rest-api-key';
const KAKAO_REDIRECT_URI = 'http://localhost/oauth/callback';
const RETURN_TO = '/markets/mangwon-fresh/products/402?tab=detail';

const getCookieHeader = (response: Response, name: string) => {
  return response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${name}=`));
};

const getDecodedCookieValue = (response: Response, name: string) => {
  const cookieHeader = getCookieHeader(response, name);
  const cookieValue = cookieHeader?.split(';')[0]?.slice(name.length + 1);

  return cookieValue ? decodeURIComponent(cookieValue) : undefined;
};

const expectOAuthCookiesToBeDeleted = (response: Response) => {
  expect(response.headers.getSetCookie()).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/kakao_oauth_state=;.*Max-Age=0/),
      expect.stringMatching(/kakao_oauth_return_to=;.*Max-Age=0/),
    ]),
  );
};

describe('GET /api/auth/kakao/authorize', () => {
  beforeEach(() => {
    vi.stubEnv('KAKAO_REST_API_KEY', KAKAO_REST_API_KEY);
    vi.stubEnv('KAKAO_REDIRECT_URI', KAKAO_REDIRECT_URI);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('REST API 인가 URL과 일치하는 state와 returnTo를 HttpOnly cookie에 저장한다', async () => {
    const requestUrl = new URL('http://localhost/api/auth/kakao/authorize');
    requestUrl.searchParams.set('returnTo', RETURN_TO);

    const response = await GET(new Request(requestUrl));
    const location = new URL(response.headers.get('location') ?? '');
    const state = location.searchParams.get('state');
    const stateCookie = getCookieHeader(response, 'kakao_oauth_state');
    const returnToCookie = getCookieHeader(response, 'kakao_oauth_return_to');

    expect(response.status).toBe(307);
    expect(location.origin + location.pathname).toBe('https://kauth.kakao.com/oauth/authorize');
    expect(location.searchParams.get('response_type')).toBe('code');
    expect(location.searchParams.get('client_id')).toBe(KAKAO_REST_API_KEY);
    expect(location.searchParams.get('redirect_uri')).toBe(KAKAO_REDIRECT_URI);
    expect(state).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(stateCookie).toContain(`kakao_oauth_state=${state}`);
    expect(stateCookie).toContain('HttpOnly');
    expect(stateCookie).toMatch(/SameSite=Lax/i);
    expect(stateCookie).toContain('Path=/api/auth/kakao');
    expect(stateCookie).toContain('Max-Age=600');
    expect(getDecodedCookieValue(response, 'kakao_oauth_return_to')).toBe(RETURN_TO);
    expect(returnToCookie).toContain('HttpOnly');
    expect(returnToCookie).toMatch(/SameSite=Lax/i);
    expect(returnToCookie).toContain('Path=/api/auth/kakao');
    expect(returnToCookie).toContain('Max-Age=600');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it.each([
    ['https://evil.example/markets'],
    ['//evil.example/markets'],
    ['/login'],
    ['/markets-evil'],
  ])('안전하지 않은 returnTo %s는 /markets로 대체해 저장한다', async (returnTo) => {
    const requestUrl = new URL('http://localhost/api/auth/kakao/authorize');
    requestUrl.searchParams.set('returnTo', returnTo);

    const response = await GET(new Request(requestUrl));

    expect(getDecodedCookieValue(response, 'kakao_oauth_return_to')).toBe('/markets');
  });

  it.each([
    ['KAKAO_REST_API_KEY', ''],
    ['KAKAO_REDIRECT_URI', 'not-a-url'],
    ['KAKAO_REDIRECT_URI', 'https://other.test/oauth/callback'],
    ['KAKAO_REDIRECT_URI', 'http://localhost/wrong-callback'],
  ])('%s 설정이 유효하지 않으면 callback 설정 오류로 이동한다', async (envName, value) => {
    vi.stubEnv(envName, value);

    const response = await GET(new Request('http://localhost/api/auth/kakao/authorize'));
    const location = new URL(response.headers.get('location') ?? '');

    expect(location.origin + location.pathname).toBe('http://localhost/oauth/callback');
    expect(location.searchParams.get('error')).toBe('oauth_configuration_error');
    expectOAuthCookiesToBeDeleted(response);
  });
});
