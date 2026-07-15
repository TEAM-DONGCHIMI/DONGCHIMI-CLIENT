import { useToast } from '@dongchimi/shared/toast';
import { useNavigate } from 'react-router';

import { isApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import { useSignupMutation } from '../../hooks/use-signup-mutation';

export interface SignupSubmitParams {
  email: string;
  password: string;
}

const SIGNUP_FALLBACK_ERROR_MESSAGE = '회원가입에 실패했습니다. 다시 시도해주세요.';
const SIGNUP_ERROR_TOAST_ID = 'signup-submit-error';

const getSignupErrorMessage = (error: unknown) => {
  if (isApiError(error) && error.message.length > 0) {
    return error.message;
  }

  return SIGNUP_FALLBACK_ERROR_MESSAGE;
};

export const useSignupSubmit = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const signupMutation = useSignupMutation();

  const clearSubmitErrorMessage = () => {
    toast.dismiss(SIGNUP_ERROR_TOAST_ID);
  };

  const submit = async (params: SignupSubmitParams) => {
    toast.dismiss(SIGNUP_ERROR_TOAST_ID);

    try {
      await signupMutation.mutateAsync(params);
      navigate(MARKET_OWNER_ROUTES.marketInformationRegistration);
    } catch (error) {
      toast.error(getSignupErrorMessage(error), { id: SIGNUP_ERROR_TOAST_ID });
    }
  };

  return {
    action: {
      clearSubmitErrorMessage,
      submit,
    },
    state: {
      isSubmitting: signupMutation.isPending,
    },
  };
};
