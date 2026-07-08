import { useState, type ChangeEventHandler } from 'react';

import { validateSignupEmail } from '../utils/signup-email-validation';

type SignupEmailFieldStateTypes =
  | {
      email: string;
      errorMessage: string;
      handleEmailChange: ChangeEventHandler<HTMLInputElement>;
      hasError: true;
    }
  | {
      email: string;
      handleEmailChange: ChangeEventHandler<HTMLInputElement>;
      hasError: false;
    };

export const useSignupEmailField = (): SignupEmailFieldStateTypes => {
  const [email, setEmail] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const emailValidation = validateSignupEmail(email);

  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.currentTarget.value);
    setIsEmailTouched(true);
  };

  if (isEmailTouched && !emailValidation.ok) {
    return {
      email,
      errorMessage: emailValidation.message,
      handleEmailChange,
      hasError: true,
    };
  }

  return {
    email,
    handleEmailChange,
    hasError: false,
  };
};
