import { useState } from 'react';
import { useNavigate } from 'react-router';

import { MARKET_OWNER_ROUTES, type MarketOwnerRouteTypes } from '@/shared/constants/routes';

const LOGIN_MISMATCH_ERROR_MESSAGE = '이메일 또는 비밀번호가 일치하지 않습니다.';
const LOGIN_NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 후 다시 시도해주세요.';

export interface LoginSubmitParams {
  email: string;
  keepSignedIn: boolean;
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

const defaultSubmitLogin: LoginSubmitHandlerTypes = async () => {
  return { redirectTo: MARKET_OWNER_ROUTES.home };
};

const getLoginErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    (error as LoginSubmitError).type === 'network'
  ) {
    return LOGIN_NETWORK_ERROR_MESSAGE;
  }

  return LOGIN_MISMATCH_ERROR_MESSAGE;
};

export const useLoginSubmit = ({
  submitLogin = defaultSubmitLogin,
}: UseLoginSubmitOptions = {}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>();

  const clearLoginErrorMessage = () => {
    setLoginErrorMessage(undefined);
  };

  const submit = async (params: LoginSubmitParams) => {
    setIsSubmitting(true);
    setLoginErrorMessage(undefined);

    try {
      const result = await submitLogin(params);

      navigate(result.redirectTo);
    } catch (error) {
      setLoginErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clearLoginErrorMessage,
    isSubmitting,
    loginErrorMessage,
    submit,
  };
};
