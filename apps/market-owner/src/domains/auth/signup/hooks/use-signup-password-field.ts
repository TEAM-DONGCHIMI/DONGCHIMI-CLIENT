import { useState, type ChangeEventHandler } from 'react';

import { validateSignupPassword } from '../utils/signup-password-validation';

type SignupPasswordFieldStateTypes =
  | {
      errorMessage: string;
      handlePasswordChange: ChangeEventHandler<HTMLInputElement>;
      hasError: true;
      password: string;
    }
  | {
      handlePasswordChange: ChangeEventHandler<HTMLInputElement>;
      hasError: false;
      password: string;
    };

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
      errorMessage: passwordValidation.message,
      handlePasswordChange,
      hasError: true,
      password,
    };
  }

  return {
    handlePasswordChange,
    hasError: false,
    password,
  };
};
