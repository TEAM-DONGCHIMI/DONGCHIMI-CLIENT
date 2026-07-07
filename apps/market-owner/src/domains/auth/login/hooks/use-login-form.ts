import { useState, type ChangeEvent } from 'react';

import { getEmailErrorMessage, isAllowedEmailInputValue } from '../utils/email-validation';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [hasEditedEmail, setHasEditedEmail] = useState(false);

  const emailErrorMessage = hasEditedEmail ? getEmailErrorMessage(email) : undefined;
  const emailStatusProps =
    emailErrorMessage !== undefined
      ? { errorMessage: emailErrorMessage, status: 'error' as const }
      : { status: 'default' as const };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;

    setHasEditedEmail(true);

    if (isAllowedEmailInputValue(nextEmail)) {
      setEmail(nextEmail);
    }
  };

  return {
    email,
    emailStatusProps,
    handleEmailChange,
  };
};
