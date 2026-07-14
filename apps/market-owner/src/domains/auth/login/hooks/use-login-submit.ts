import { isApiResponseValidationError } from '@dongchimi/shared/api';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

import { useLoginMutation } from '../../hooks/use-login-mutation';

const LOGIN_MISMATCH_ERROR_MESSAGE = '이메일 또는 비밀번호가 일치하지 않습니다.';
const LOGIN_NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 후 다시 시도해주세요.';
const LOGIN_UNEXPECTED_ERROR_MESSAGE =
  '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

export interface LoginSubmitParams {
  email: string;
  isAutoLogin: boolean;
  password: string;
}

export interface LoginSubmitResult {
  redirectTo: MarketOwnerRouteTypes;
}

export type LoginSubmitHandlerTypes = (params: LoginSubmitParams) => Promise<LoginSubmitResult>;

interface LoginSubmitError {
  type?: 'auth' | 'network';
}

export interface UseLoginSubmitOptions {
  submitLogin?: LoginSubmitHandlerTypes;
}

const getLoginErrorMessage = (error: unknown) => {
  if (isApiError(error)) {
    if (error.type === 'auth') {
      return LOGIN_MISMATCH_ERROR_MESSAGE;
    }

    if (error.type === 'network') {
      return LOGIN_NETWORK_ERROR_MESSAGE;
    }

    return error.message.length > 0 ? error.message : LOGIN_UNEXPECTED_ERROR_MESSAGE;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    (error as LoginSubmitError).type === 'network'
  ) {
    return LOGIN_NETWORK_ERROR_MESSAGE;
  }

  if (typeof error === 'object' && error !== null && (error as LoginSubmitError).type === 'auth') {
    return LOGIN_MISMATCH_ERROR_MESSAGE;
  }

  if (isApiResponseValidationError(error)) {
    return LOGIN_UNEXPECTED_ERROR_MESSAGE;
  }

  return LOGIN_UNEXPECTED_ERROR_MESSAGE;
};

export const useLoginSubmit = ({ submitLogin }: UseLoginSubmitOptions = {}) => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>();

  const clearLoginErrorMessage = () => {
    setLoginErrorMessage(undefined);
  };

  const submit = async (params: LoginSubmitParams) => {
    setIsSubmitting(true);
    setLoginErrorMessage(undefined);

    try {
      const result =
        submitLogin !== undefined
          ? await submitLogin(params)
          : await loginMutation.mutateAsync(params).then(() => ({
              redirectTo: MARKET_OWNER_ROUTES.home,
            }));

      navigate(result.redirectTo);
    } catch (error) {
      setLoginErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    action: {
      clearLoginErrorMessage,
      submit,
    },
    state: {
      isSubmitting,
      loginErrorMessage,
    },
  };
};
