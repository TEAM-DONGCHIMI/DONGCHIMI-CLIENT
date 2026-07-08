import { useState, type ChangeEventHandler } from 'react';

import { validateSignupEmail } from '../utils/signup-email-validation';

type SignupEmailTextInputStatusPropsTypes =
  | {
      errorMessage: string;
      status: 'error';
    }
  | {
      status: 'default';
    };

interface SignupEmailFieldStateTypes {
  email: string;
  handleEmailChange: ChangeEventHandler<HTMLInputElement>;
  textInputStatusProps: SignupEmailTextInputStatusPropsTypes;
}

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
      handleEmailChange,
      textInputStatusProps: {
        errorMessage: emailValidation.message,
        status: 'error',
      },
    };
  }

  return {
    email,
    handleEmailChange,
    textInputStatusProps: {
      status: 'default',
    },
  };
};
