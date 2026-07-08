import { useState, type ChangeEventHandler } from 'react';

import { validateSignupPasswordConfirm } from '../utils/signup-password-confirm-validation';

type SignupPasswordConfirmTextInputStatusPropsTypes =
  | {
      errorMessage: string;
      status: 'error';
    }
  | {
      status: 'default';
    };

interface SignupPasswordConfirmFieldStateTypes {
  handlePasswordConfirmChange: ChangeEventHandler<HTMLInputElement>;
  passwordConfirm: string;
  textInputStatusProps: SignupPasswordConfirmTextInputStatusPropsTypes;
}

export const useSignupPasswordConfirmField = (
  password: string,
): SignupPasswordConfirmFieldStateTypes => {
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordConfirmTouched, setIsPasswordConfirmTouched] = useState(false);
  const passwordConfirmValidation = validateSignupPasswordConfirm(passwordConfirm, password);

  const handlePasswordConfirmChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPasswordConfirm(event.currentTarget.value);
    setIsPasswordConfirmTouched(true);
  };

  if (isPasswordConfirmTouched && !passwordConfirmValidation.ok) {
    return {
      handlePasswordConfirmChange,
      passwordConfirm,
      textInputStatusProps: {
        errorMessage: passwordConfirmValidation.message,
        status: 'error',
      },
    };
  }

  return {
    handlePasswordConfirmChange,
    passwordConfirm,
    textInputStatusProps: {
      status: 'default',
    },
  };
};
