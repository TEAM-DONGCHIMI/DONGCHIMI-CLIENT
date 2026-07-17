import type { NextResponse } from 'next/server';

export const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  kakaoOAuthReturnTo: 'kakao_oauth_return_to',
  kakaoOAuthState: 'kakao_oauth_state',
  refreshToken: 'refreshToken',
} as const;

export const UPSTREAM_AUTH_COOKIE_NAMES = {
  refreshToken: 'RefreshToken',
} as const;

const AUTH_COOKIE_PATHS = {
  access: '/',
  kakaoOAuth: '/api/auth/kakao',
  refresh: '/api/auth/token/refresh',
} as const;

const AUTH_COOKIE_MAX_AGES = {
  kakaoOAuthReturnTo: 10 * 60,
  kakaoOAuthState: 10 * 60,
} as const;

const getSecureCookieOption = () => process.env.NODE_ENV === 'production';

const getBaseCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: getSecureCookieOption(),
});

export const getRequestCookie = (request: Request, cookieName: string) => {
  const cookie = request.headers
    .get('cookie')
    ?.split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`));

  return cookie?.slice(cookieName.length + 1);
};

const getSetCookieHeaders = (headers: Headers) => {
  const setCookieHeaders = headers.getSetCookie();

  if (setCookieHeaders.length > 0) {
    return setCookieHeaders;
  }

  const setCookieHeader = headers.get('set-cookie');

  return setCookieHeader ? [setCookieHeader] : [];
};

export const getRefreshTokenSetCookieHeaders = (headers: Headers) => {
  return getSetCookieHeaders(headers).filter((cookie) =>
    new RegExp(`^${AUTH_COOKIE_NAMES.refreshToken}=`, 'i').test(cookie),
  );
};

const rewriteRefreshTokenCookie = (setCookieHeader: string) => {
  const preservedAttributes = setCookieHeader
    .split(';')
    .map((attribute) => attribute.trim())
    .filter(
      (attribute, index) =>
        index === 0 || !/^(Domain|HttpOnly|Path|SameSite|Secure)(?:=|$)/i.test(attribute),
    );

  preservedAttributes.push(`Path=${AUTH_COOKIE_PATHS.refresh}`, 'HttpOnly', 'SameSite=Lax');

  if (getSecureCookieOption()) {
    preservedAttributes.push('Secure');
  }

  return preservedAttributes.join('; ');
};

export const appendRefreshTokenCookies = (
  response: NextResponse,
  refreshTokenCookies: string[],
) => {
  for (const refreshTokenCookie of refreshTokenCookies) {
    response.headers.append('set-cookie', rewriteRefreshTokenCookie(refreshTokenCookie));
  }
};

export const setAccessTokenCookie = (response: NextResponse, accessToken: string) => {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, accessToken, {
    ...getBaseCookieOptions(),
    path: AUTH_COOKIE_PATHS.access,
  });
};

export const setKakaoOAuthStateCookie = (response: NextResponse, state: string) => {
  response.cookies.set(AUTH_COOKIE_NAMES.kakaoOAuthState, state, {
    ...getBaseCookieOptions(),
    maxAge: AUTH_COOKIE_MAX_AGES.kakaoOAuthState,
    path: AUTH_COOKIE_PATHS.kakaoOAuth,
  });
};

export const setKakaoOAuthReturnToCookie = (response: NextResponse, returnTo: string) => {
  response.cookies.set(AUTH_COOKIE_NAMES.kakaoOAuthReturnTo, returnTo, {
    ...getBaseCookieOptions(),
    maxAge: AUTH_COOKIE_MAX_AGES.kakaoOAuthReturnTo,
    path: AUTH_COOKIE_PATHS.kakaoOAuth,
  });
};

export const getKakaoOAuthReturnToCookie = (request: Request) => {
  const cookieValue = getRequestCookie(request, AUTH_COOKIE_NAMES.kakaoOAuthReturnTo);

  if (!cookieValue) {
    return undefined;
  }

  try {
    return decodeURIComponent(cookieValue);
  } catch {
    return undefined;
  }
};

export const clearKakaoOAuthStateCookie = (response: NextResponse) => {
  response.cookies.set(AUTH_COOKIE_NAMES.kakaoOAuthState, '', {
    ...getBaseCookieOptions(),
    maxAge: 0,
    path: AUTH_COOKIE_PATHS.kakaoOAuth,
  });

  return response;
};

export const clearKakaoOAuthCookies = (response: NextResponse) => {
  clearKakaoOAuthStateCookie(response);
  response.cookies.set(AUTH_COOKIE_NAMES.kakaoOAuthReturnTo, '', {
    ...getBaseCookieOptions(),
    maxAge: 0,
    path: AUTH_COOKIE_PATHS.kakaoOAuth,
  });

  return response;
};

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, '', {
    ...getBaseCookieOptions(),
    maxAge: 0,
    path: AUTH_COOKIE_PATHS.access,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, '', {
    ...getBaseCookieOptions(),
    maxAge: 0,
    path: AUTH_COOKIE_PATHS.refresh,
  });

  return response;
};
