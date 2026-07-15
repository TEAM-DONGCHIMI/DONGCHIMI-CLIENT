import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAMES, AUTH_COOKIE_PATHS } from '@/shared/auth';
import { type UserApiTypes } from '@/shared/api';
import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

const createErrorResponse = (status: number, code: string, message: string) => {
  return NextResponse.json(
    {
      code,
      message,
      success: false,
    },
    { status },
  );
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
  const cookieWithoutDomain = setCookieHeader.replace(/;\s*Domain=[^;]+/gi, '');

  if (/;\s*Path=[^;]+/i.test(cookieWithoutDomain)) {
    return cookieWithoutDomain.replace(/;\s*Path=[^;]+/i, `; Path=${AUTH_COOKIE_PATHS.refresh}`);
  }

  return `${cookieWithoutDomain}; Path=${AUTH_COOKIE_PATHS.refresh}`;
};

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return createErrorResponse(400, 'INVALID_INPUT', '인가 코드는 필수로 입력해 주세요.');
  }

  const code =
    typeof requestBody === 'object' && requestBody !== null && 'code' in requestBody
      ? requestBody.code
      : undefined;

  if (typeof code !== 'string' || !code.trim()) {
    return createErrorResponse(400, 'INVALID_INPUT', '인가 코드는 필수로 입력해 주세요.');
  }

  try {
    const serverApi = await createServerApi({ includeAccessToken: false });
    const upstreamResponse = await serverApi.post(API_ENDPOINTS.user.auth.socialLogin('kakao'), {
      json: { code },
      throwHttpErrors: false,
    });
    const upstreamBody =
      (await upstreamResponse.json()) as UserApiTypes.ApiResponseOAuthLoginResponse;

    if (!upstreamResponse.ok) {
      return NextResponse.json(upstreamBody, { status: upstreamResponse.status });
    }

    const accessToken = upstreamBody.data?.accessToken;
    const refreshCookies = getSetCookieHeaders(upstreamResponse.headers).filter((cookie) =>
      new RegExp(`^${AUTH_COOKIE_NAMES.refreshToken}=`, 'i').test(cookie),
    );

    if (!accessToken || refreshCookies.length === 0) {
      return createErrorResponse(
        502,
        'OAUTH_TOKEN_MISSING',
        '로그인 응답에서 인증 정보를 확인할 수 없습니다.',
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
    return createErrorResponse(502, 'OAUTH_UPSTREAM_FAILED', '로그인 서버 연결에 실패했습니다.');
  }
}
