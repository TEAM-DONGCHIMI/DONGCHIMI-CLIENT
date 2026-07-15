import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api';
import {
  getKakaoOAuthCallbackErrorMessage,
  KakaoLoginError,
  normalizeKakaoLoginError,
} from './kakao-login-error';

describe('Kakao login error model', () => {
  it.each([
    ['OAUTH_REQUIRED_INFO_MISSING', '카카오 계정의 이메일과 성별 정보 제공에 동의해 주세요.'],
    ['DUPLICATE_SOCIAL_ACCOUNT', '이미 가입된 카카오 계정입니다.'],
    [
      'OAUTH_AUTHENTICATION_FAILED',
      '카카오 인증이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.',
    ],
    ['UNSUPPORTED_OAUTH_PROVIDER', '현재 카카오 로그인을 사용할 수 없습니다.'],
  ])('%s API 오류를 한 곳에서 사용자 메시지로 변환한다', (code, message) => {
    const error = new ApiError({
      code,
      message: 'backend message',
      status: 400,
      type: 'validation',
    });

    expect(normalizeKakaoLoginError(error)).toMatchObject({ message });
  });

  it('알 수 없는 API 오류는 backend message를 노출하지 않는다', () => {
    const error = new ApiError({
      code: 'UNKNOWN_BACKEND_ERROR',
      message: 'internal backend detail',
      status: 500,
      type: 'server',
    });

    expect(normalizeKakaoLoginError(error)).toMatchObject({
      message: '로그인에 실패했습니다. 다시 시도해 주세요.',
    });
  });

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
        loginError: new KakaoLoginError('정규화된 로그인 오류'),
        oauthError: null,
        state: 'oauth-state',
      },
      '정규화된 로그인 오류',
    ],
  ])('callback 오류 상태도 auth model에서 결정한다', (params, message) => {
    expect(getKakaoOAuthCallbackErrorMessage(params)).toBe(message);
  });
});
