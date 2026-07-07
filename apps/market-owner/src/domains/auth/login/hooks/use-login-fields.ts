import { useState, type ChangeEvent } from 'react';

import { getEmailErrorMessage, isAllowedEmailInputValue } from '../utils/email-validation';
import { getPasswordErrorMessage } from '../utils/password-validation';

interface UseLoginFieldsOptions {
  onFieldChange?: () => void;
}

export const useLoginFields = ({ onFieldChange }: UseLoginFieldsOptions = {}) => {
  const [email, setEmail] = useState('');
  const [hasEditedEmail, setHasEditedEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [hasEditedPassword, setHasEditedPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const emailValidationErrorMessage = getEmailErrorMessage(email);
  const emailErrorMessage = hasEditedEmail ? emailValidationErrorMessage : undefined;
  const emailStatusProps =
    emailErrorMessage !== undefined
      ? { errorMessage: emailErrorMessage, status: 'error' as const }
      : { status: 'default' as const };
  const passwordValidationErrorMessage = getPasswordErrorMessage(password);
  const passwordErrorMessage = hasEditedPassword ? passwordValidationErrorMessage : undefined;
  const passwordStatusProps =
    passwordErrorMessage !== undefined
      ? { errorMessage: passwordErrorMessage, status: 'error' as const }
      : { status: 'default' as const };
  const isValid =
    emailValidationErrorMessage === undefined && passwordValidationErrorMessage === undefined;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;

    setHasEditedEmail(true);
    onFieldChange?.();

    if (isAllowedEmailInputValue(nextEmail)) {
      setEmail(nextEmail);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasEditedPassword(true);
    onFieldChange?.();
    setPassword(event.target.value);
  };

  const handleKeepSignedInChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeepSignedIn(event.target.checked);
  };

  const markFieldsEdited = () => {
    setHasEditedEmail(true);
    setHasEditedPassword(true);
  };

  return {
    email,
    emailStatusProps,
    handleEmailChange,
    handleKeepSignedInChange,
    handlePasswordChange,
    isValid,
    keepSignedIn,
    markFieldsEdited,
    password,
    passwordStatusProps,
  };
};
