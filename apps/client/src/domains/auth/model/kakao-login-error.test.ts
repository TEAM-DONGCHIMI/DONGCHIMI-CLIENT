import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api';
import { getKakaoLoginErrorMessage, getKakaoOAuthCallbackErrorMessage } from './kakao-login-error';

describe('Kakao login error model', () => {
  it.each([
    ['auth', 401],
    ['validation', 400],
  ] as const)('%s API 오류는 개별 code 분기 없이 서버 메시지를 사용한다', (type, status) => {
    const error = new ApiError({
      code: 'NEW_OAUTH_ERROR_CODE',
      message: '서버가 제공한 사용자 메시지',
      status,
      type,
    });

    expect(getKakaoLoginErrorMessage(error)).toBe('서버가 제공한 사용자 메시지');
  });

  it.each(['configuration', 'network', 'server', 'unknown'] as const)(
    '%s 오류는 내부 메시지를 노출하지 않는다',
    (type) => {
      const error = new ApiError({
        code: 'INTERNAL_ERROR',
        message: 'internal backend detail',
        status: 500,
        type,
      });

      expect(getKakaoLoginErrorMessage(error)).toBe('로그인에 실패했습니다. 다시 시도해 주세요.');
    },
  );

  it.each([
    [
      { code: null, loginError: null, oauthError: null, state: null },
      '카카오 인증 정보를 확인할 수 없습니다.',
    ],
    [
      { code: null, loginError: null, oauthError: 'access_denied', state: null },
      '카카오 로그인이 취소되었습니다.',
    ],
    [
      {
        code: 'authorization-code',
        loginError: new ApiError({
          code: 'OAUTH_AUTHENTICATION_FAILED',
          message: '소셜 로그인 인증에 실패했습니다.',
          status: 401,
          type: 'auth',
        }),
        oauthError: null,
        state: 'oauth-state',
      },
      '소셜 로그인 인증에 실패했습니다.',
    ],
  ])('callback 오류 상태도 auth model에서 결정한다', (params, message) => {
    expect(getKakaoOAuthCallbackErrorMessage(params)).toBe(message);
  });
});
