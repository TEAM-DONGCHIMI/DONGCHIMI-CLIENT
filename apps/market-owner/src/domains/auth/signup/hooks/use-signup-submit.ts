import { useState } from 'react';
import { useNavigate } from 'react-router';

import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { useSignupMutation } from '../../hooks/use-signup-mutation';

export interface SignupSubmitParams {
  email: string;
  password: string;
}

const SIGNUP_FALLBACK_ERROR_MESSAGE = '회원가입에 실패했습니다. 다시 시도해주세요.';

const getSignupErrorMessage = (error: unknown) => {
  if (isApiError(error) && error.message.length > 0) {
    return error.message;
  }

  return SIGNUP_FALLBACK_ERROR_MESSAGE;
};

export const useSignupSubmit = () => {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();

  const clearSubmitErrorMessage = () => {
    setSubmitErrorMessage(undefined);
  };

  const submit = async (params: SignupSubmitParams) => {
    setSubmitErrorMessage(undefined);

    try {
      await signupMutation.mutateAsync(params);
      navigate(MARKET_OWNER_ROUTES.marketInformationRegistration);
    } catch (error) {
      setSubmitErrorMessage(getSignupErrorMessage(error));
    }
  };

  return {
    action: {
      clearSubmitErrorMessage,
      submit,
    },
    state: {
      isSubmitting: signupMutation.isPending,
      submitErrorMessage,
    },
  };
};
