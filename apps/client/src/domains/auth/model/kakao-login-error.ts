import { isApiError } from '@/shared/api';

const DEFAULT_LOGIN_ERROR_MESSAGE = '로그인에 실패했습니다. 다시 시도해 주세요.';
const INVALID_CALLBACK_MESSAGE = '카카오 인증 정보를 확인할 수 없습니다.';

const CALLBACK_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  access_denied: '카카오 로그인이 취소되었습니다.',
  oauth_configuration_error: '카카오 로그인을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.',
};

export const getKakaoLoginErrorMessage = (error: unknown) => {
  if (!isApiError(error)) {
    return DEFAULT_LOGIN_ERROR_MESSAGE;
  }

  if (error.type === 'auth' || error.type === 'validation') {
    return error.message;
  }

  return DEFAULT_LOGIN_ERROR_MESSAGE;
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
    return getKakaoLoginErrorMessage(loginError);
  }

  return undefined;
};
