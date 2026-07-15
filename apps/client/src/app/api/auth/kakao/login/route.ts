import { timingSafeEqual } from 'node:crypto';

import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  appendRefreshTokenCookies,
  AUTH_COOKIE_NAMES,
  clearKakaoOAuthStateCookie,
  getRefreshTokenSetCookieHeaders,
  getRequestCookie,
  setAccessTokenCookie,
} from '@/shared/auth';
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

const loginRequestSchema = z.object({
  code: z.string().trim().min(1).max(4096),
  state: z.string().trim().min(1).max(128),
});

const isMatchingOAuthState = (cookieState: string | undefined, callbackState: string) => {
  if (!cookieState) {
    return false;
  }

  const cookieStateBuffer = Buffer.from(cookieState);
  const callbackStateBuffer = Buffer.from(callbackState);

  return (
    cookieStateBuffer.length === callbackStateBuffer.length &&
    timingSafeEqual(cookieStateBuffer, callbackStateBuffer)
  );
};

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return clearKakaoOAuthStateCookie(
      createErrorResponse(400, 'INVALID_INPUT', '인가 코드와 state는 필수로 입력해 주세요.'),
    );
  }

  const parsedRequestBody = loginRequestSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return clearKakaoOAuthStateCookie(
      createErrorResponse(400, 'INVALID_INPUT', '인가 코드와 state는 필수로 입력해 주세요.'),
    );
  }

  const { code, state } = parsedRequestBody.data;
  const cookieState = getRequestCookie(request, AUTH_COOKIE_NAMES.kakaoOAuthState);

  if (!isMatchingOAuthState(cookieState, state)) {
    return clearKakaoOAuthStateCookie(
      createErrorResponse(
        400,
        'OAUTH_STATE_INVALID',
        '카카오 로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.',
      ),
    );
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
      return clearKakaoOAuthStateCookie(
        NextResponse.json(upstreamBody, { status: upstreamResponse.status }),
      );
    }

    const accessToken = upstreamBody.data?.accessToken;
    const refreshCookies = getRefreshTokenSetCookieHeaders(upstreamResponse.headers);

    if (!accessToken || refreshCookies.length === 0) {
      return clearKakaoOAuthStateCookie(
        createErrorResponse(
          502,
          'OAUTH_TOKEN_MISSING',
          '로그인 응답에서 인증 정보를 확인할 수 없습니다.',
        ),
      );
    }

    const response = NextResponse.json({
      code: upstreamBody.code,
      message: upstreamBody.message,
      success: true,
    });

    setAccessTokenCookie(response, accessToken);
    clearKakaoOAuthStateCookie(response);
    appendRefreshTokenCookies(response, refreshCookies);

    return response;
  } catch {
    return clearKakaoOAuthStateCookie(
      createErrorResponse(502, 'OAUTH_UPSTREAM_FAILED', '로그인 서버 연결에 실패했습니다.'),
    );
  }
}
