import { API_ENDPOINTS, type CommonApiTypes } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAMES, AUTH_COOKIE_PATHS, UPSTREAM_AUTH_COOKIE_NAMES } from '@/shared/auth';
import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

const createErrorResponse = (status: number, code: string, message: string) => {
  return NextResponse.json({ code, message, success: false }, { status });
};

const getRequestCookie = (request: Request, cookieName: string) => {
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

const rewriteRefreshCookie = (setCookieHeader: string) => {
  const preservedAttributes = setCookieHeader
    .split(';')
    .map((attribute) => attribute.trim())
    .filter(
      (attribute, index) =>
        index === 0 || !/^(Domain|HttpOnly|Path|SameSite|Secure)(?:=|$)/i.test(attribute),
    );

  preservedAttributes.push(`Path=${AUTH_COOKIE_PATHS.refresh}`, 'HttpOnly', 'SameSite=Lax');

  if (process.env.NODE_ENV === 'production') {
    preservedAttributes.push('Secure');
  }

  return preservedAttributes.join('; ');
};

const clearAuthCookies = (response: NextResponse) => {
  const secure = process.env.NODE_ENV === 'production';

  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, '', {
    httpOnly: true,
    maxAge: 0,
    path: AUTH_COOKIE_PATHS.refresh,
    sameSite: 'lax',
    secure,
  });

  return response;
};

export async function POST(request: Request) {
  const refreshToken = getRequestCookie(request, AUTH_COOKIE_NAMES.refreshToken);

  if (!refreshToken) {
    return clearAuthCookies(
      createErrorResponse(401, 'REFRESH_TOKEN_NOT_FOUND', '리프레시 토큰이 존재하지 않습니다.'),
    );
  }

  try {
    const serverApi = await createServerApi({ includeAccessToken: false });
    const upstreamResponse = await serverApi.post(API_ENDPOINTS.common.auth.refresh, {
      headers: { Cookie: `${UPSTREAM_AUTH_COOKIE_NAMES.refreshToken}=${refreshToken}` },
      throwHttpErrors: false,
    });
    const upstreamBody =
      (await upstreamResponse.json()) as CommonApiTypes.ApiResponseReissueTokenResponse;

    if (!upstreamResponse.ok) {
      return clearAuthCookies(NextResponse.json(upstreamBody, { status: upstreamResponse.status }));
    }

    const accessToken = upstreamBody.data?.accessToken;
    const refreshCookies = getSetCookieHeaders(upstreamResponse.headers).filter((cookie) =>
      new RegExp(`^${AUTH_COOKIE_NAMES.refreshToken}=`, 'i').test(cookie),
    );

    if (!accessToken || refreshCookies.length === 0) {
      return clearAuthCookies(
        createErrorResponse(
          502,
          'REFRESH_TOKEN_RESPONSE_INVALID',
          '토큰 갱신 응답에서 인증 정보를 확인할 수 없습니다.',
        ),
      );
    }

    const response = NextResponse.json({
      code: upstreamBody.code,
      message: upstreamBody.message,
      success: true,
    });

    response.cookies.set(AUTH_COOKIE_NAMES.accessToken, accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    for (const refreshCookie of refreshCookies) {
      response.headers.append('set-cookie', rewriteRefreshCookie(refreshCookie));
    }

    return response;
  } catch {
    return clearAuthCookies(
      createErrorResponse(502, 'REFRESH_UPSTREAM_FAILED', '토큰 갱신 서버 연결에 실패했습니다.'),
    );
  }
}
