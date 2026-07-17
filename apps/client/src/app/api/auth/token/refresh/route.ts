import { API_ENDPOINTS, type CommonApiTypes } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';

import {
  appendRefreshTokenCookies,
  AUTH_COOKIE_NAMES,
  clearAuthCookies,
  getRefreshTokenSetCookieHeaders,
  getRequestCookie,
  setAccessTokenCookie,
  UPSTREAM_AUTH_COOKIE_NAMES,
} from '@/shared/auth';
import { createServerApi } from '@/shared/api/server-client';

export const runtime = 'nodejs';

const createErrorResponse = (status: number, code: string, message: string) => {
  return NextResponse.json({ code, message, success: false }, { status });
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
      const response = NextResponse.json(upstreamBody, { status: upstreamResponse.status });

      return upstreamResponse.status === 401 ? clearAuthCookies(response) : response;
    }

    const accessToken = upstreamBody.data?.accessToken;
    const refreshCookies = getRefreshTokenSetCookieHeaders(upstreamResponse.headers);

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

    setAccessTokenCookie(response, accessToken);
    appendRefreshTokenCookies(response, refreshCookies);

    return response;
  } catch {
    return createErrorResponse(
      502,
      'REFRESH_UPSTREAM_FAILED',
      '토큰 갱신 서버 연결에 실패했습니다.',
    );
  }
}
