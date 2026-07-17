import { timingSafeEqual } from 'node:crypto';

import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  appendRefreshTokenCookies,
  AUTH_COOKIE_NAMES,
  clearKakaoOAuthCookies,
  getKakaoOAuthReturnToCookie,
  getRefreshTokenSetCookieHeaders,
  getRequestCookie,
  setAccessTokenCookie,
} from '@/shared/auth';
import { normalizeApiError, type ApiErrorCategoryTypes } from '@/shared/api';
import { createServerApi } from '@/shared/api/server-client';
import { normalizeAuthReturnTo } from '@/shared/auth/auth-return-to';

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

interface ErrorResponseDefinition {
  code: string;
  message: string;
  status: number;
}

const DEFAULT_ERROR_RESPONSE: ErrorResponseDefinition = {
  code: 'OAUTH_INTERNAL_ERROR',
  message: '로그인 처리 중 오류가 발생했습니다.',
  status: 500,
};

const ERROR_RESPONSE_BY_TYPE: Partial<Record<ApiErrorCategoryTypes, ErrorResponseDefinition>> = {
  configuration: {
    code: 'OAUTH_CONFIGURATION_ERROR',
    message: '로그인 서버 설정을 확인할 수 없습니다.',
    status: 500,
  },
  network: {
    code: 'OAUTH_UPSTREAM_FAILED',
    message: '로그인 서버 연결에 실패했습니다.',
    status: 502,
  },
};

const loginRequestSchema = z.object({
  code: z.string().trim().min(1).max(4096),
  state: z.string().trim().min(1).max(128),
});

const upstreamResponseSchema = z.object({
  code: z.string(),
  data: z
    .object({
      accessToken: z.string().optional(),
    })
    .nullable()
    .optional(),
  message: z.string(),
  success: z.boolean(),
});

const readUpstreamResponse = async (response: Response) => {
  try {
    return upstreamResponseSchema.safeParse(await response.json());
  } catch {
    return undefined;
  }
};

const createCaughtErrorResponse = async (error: unknown) => {
  const normalizedError = await normalizeApiError(error);
  const definition = ERROR_RESPONSE_BY_TYPE[normalizedError.type] ?? DEFAULT_ERROR_RESPONSE;

  return createErrorResponse(definition.status, definition.code, definition.message);
};

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
  const redirectTo = normalizeAuthReturnTo(getKakaoOAuthReturnToCookie(request));
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return clearKakaoOAuthCookies(
      createErrorResponse(400, 'INVALID_INPUT', '인가 코드와 state는 필수로 입력해 주세요.'),
    );
  }

  const parsedRequestBody = loginRequestSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return clearKakaoOAuthCookies(
      createErrorResponse(400, 'INVALID_INPUT', '인가 코드와 state는 필수로 입력해 주세요.'),
    );
  }

  const { code, state } = parsedRequestBody.data;
  const cookieState = getRequestCookie(request, AUTH_COOKIE_NAMES.kakaoOAuthState);

  if (!isMatchingOAuthState(cookieState, state)) {
    return clearKakaoOAuthCookies(
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
    const parsedUpstreamBody = await readUpstreamResponse(upstreamResponse);

    if (!parsedUpstreamBody?.success) {
      return clearKakaoOAuthCookies(
        createErrorResponse(
          502,
          'OAUTH_UPSTREAM_INVALID_RESPONSE',
          '로그인 서버 응답을 확인할 수 없습니다.',
        ),
      );
    }

    const upstreamBody = parsedUpstreamBody.data;

    if (!upstreamResponse.ok) {
      return clearKakaoOAuthCookies(
        NextResponse.json(upstreamBody, { status: upstreamResponse.status }),
      );
    }

    const accessToken = upstreamBody.data?.accessToken;

    if (!accessToken) {
      return clearKakaoOAuthCookies(
        createErrorResponse(
          502,
          'OAUTH_TOKEN_MISSING',
          '로그인 응답에서 인증 정보를 확인할 수 없습니다.',
        ),
      );
    }

    const refreshCookies = getRefreshTokenSetCookieHeaders(upstreamResponse.headers);
    const response = NextResponse.json({
      code: upstreamBody.code,
      message: upstreamBody.message,
      redirectTo,
      success: true,
    });

    setAccessTokenCookie(response, accessToken);
    clearKakaoOAuthCookies(response);
    appendRefreshTokenCookies(response, refreshCookies);

    return response;
  } catch (error) {
    return clearKakaoOAuthCookies(await createCaughtErrorResponse(error));
  }
}
