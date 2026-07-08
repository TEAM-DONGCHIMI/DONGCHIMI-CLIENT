import { useState, type ChangeEventHandler } from 'react';

import { validateSignupPassword } from '../utils/signup-password-validation';

type SignupPasswordTextInputStatusPropsTypes =
  | {
      errorMessage: string;
      status: 'error';
    }
  | {
      status: 'default';
    };

interface SignupPasswordFieldStateTypes {
  handlePasswordChange: ChangeEventHandler<HTMLInputElement>;
  password: string;
  textInputStatusProps: SignupPasswordTextInputStatusPropsTypes;
}

export const useSignupPasswordField = (): SignupPasswordFieldStateTypes => {
  const [password, setPassword] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const passwordValidation = validateSignupPassword(password);

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.currentTarget.value);
    setIsPasswordTouched(true);
  };

  if (isPasswordTouched && !passwordValidation.ok) {
    return {
      handlePasswordChange,
      password,
      textInputStatusProps: {
        errorMessage: passwordValidation.message,
        status: 'error',
      },
    };
  }

  return {
    handlePasswordChange,
    password,
    textInputStatusProps: {
      status: 'default',
    },
  };
};
