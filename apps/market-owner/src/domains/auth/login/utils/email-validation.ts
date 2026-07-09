import { AUTH_EMAIL_ERROR_MESSAGES } from '../../constants/auth-messages';
import { AUTH_EMAIL_ALLOWED_CHARACTERS_PATTERN } from '../../constants/auth-patterns';

export const EMAIL_ERROR_MESSAGES = {
  required: AUTH_EMAIL_ERROR_MESSAGES.required,
  invalidFormat: AUTH_EMAIL_ERROR_MESSAGES.format,
} as const;

export const EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,})+$/;

export const isAllowedEmailInputValue = (email: string) => {
  return AUTH_EMAIL_ALLOWED_CHARACTERS_PATTERN.test(email);
};

export const getEmailErrorMessage = (email: string) => {
  if (email.length === 0) {
    return EMAIL_ERROR_MESSAGES.required;
  }

  if (!EMAIL_PATTERN.test(email)) {
    return EMAIL_ERROR_MESSAGES.invalidFormat;
  }

  return undefined;
};
