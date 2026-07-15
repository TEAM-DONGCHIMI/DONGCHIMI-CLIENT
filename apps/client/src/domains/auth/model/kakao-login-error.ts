import { isApiError } from '@/shared/api';

const DEFAULT_LOGIN_ERROR_MESSAGE = '로그인에 실패했습니다. 다시 시도해 주세요.';
const INVALID_CALLBACK_MESSAGE = '카카오 인증 정보를 확인할 수 없습니다.';

const API_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  DUPLICATE_SOCIAL_ACCOUNT: '이미 가입된 카카오 계정입니다.',
  INVALID_INPUT: '카카오 인증이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.',
  OAUTH_AUTHENTICATION_FAILED:
    '카카오 인증이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.',
  OAUTH_REQUIRED_INFO_MISSING: '카카오 계정의 이메일과 성별 정보 제공에 동의해 주세요.',
  OAUTH_STATE_INVALID: INVALID_CALLBACK_MESSAGE,
  UNSUPPORTED_OAUTH_PROVIDER: '현재 카카오 로그인을 사용할 수 없습니다.',
};

const CALLBACK_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  access_denied: '카카오 로그인이 취소되었습니다.',
  oauth_configuration_error: '카카오 로그인을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.',
};

export class KakaoLoginError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'KakaoLoginError';
  }
}

export const normalizeKakaoLoginError = (error: unknown) => {
  if (error instanceof KakaoLoginError) {
    return error;
  }

  const message = isApiError(error)
    ? (API_ERROR_MESSAGES[error.code ?? ''] ?? DEFAULT_LOGIN_ERROR_MESSAGE)
    : DEFAULT_LOGIN_ERROR_MESSAGE;

  return new KakaoLoginError(message, error);
};

interface GetKakaoOAuthCallbackErrorMessageParams {
  code: string | null;
  loginError: unknown;
  oauthError: string | null;
  state: string | null;
}

export const getKakaoOAuthCallbackErrorMessage = ({
  code,
  loginError,
  oauthError,
  state,
}: GetKakaoOAuthCallbackErrorMessageParams) => {
  if (oauthError) {
    return CALLBACK_ERROR_MESSAGES[oauthError] ?? DEFAULT_LOGIN_ERROR_MESSAGE;
  }

  if (!code || !state) {
    return INVALID_CALLBACK_MESSAGE;
  }

  if (loginError) {
    return normalizeKakaoLoginError(loginError).message;
  }

  return undefined;
};
