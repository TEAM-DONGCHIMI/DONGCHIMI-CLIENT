import { useState, type ChangeEvent } from 'react';

import { getEmailErrorMessage, isAllowedEmailInputValue } from '../utils/email-validation';
import { getPasswordErrorMessage } from '../utils/password-validation';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [hasEditedEmail, setHasEditedEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [hasEditedPassword, setHasEditedPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const emailErrorMessage = hasEditedEmail ? getEmailErrorMessage(email) : undefined;
  const emailStatusProps =
    emailErrorMessage !== undefined
      ? { errorMessage: emailErrorMessage, status: 'error' as const }
      : { status: 'default' as const };
  const passwordErrorMessage = hasEditedPassword ? getPasswordErrorMessage(password) : undefined;
  const passwordStatusProps =
    passwordErrorMessage !== undefined
      ? { errorMessage: passwordErrorMessage, status: 'error' as const }
      : { status: 'default' as const };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;

    setHasEditedEmail(true);

    if (isAllowedEmailInputValue(nextEmail)) {
      setEmail(nextEmail);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasEditedPassword(true);
    setPassword(event.target.value);
  };

  const handleKeepSignedInChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeepSignedIn(event.target.checked);
  };

  return {
    email,
    emailStatusProps,
    handleEmailChange,
    handleKeepSignedInChange,
    handlePasswordChange,
    keepSignedIn,
    password,
    passwordStatusProps,
  };
};
