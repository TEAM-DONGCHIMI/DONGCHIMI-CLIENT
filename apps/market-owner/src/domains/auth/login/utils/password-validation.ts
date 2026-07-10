import { AUTH_PASSWORD_ERROR_MESSAGES } from '../../constants/auth-messages';

export const PASSWORD_ERROR_MESSAGES = {
  required: AUTH_PASSWORD_ERROR_MESSAGES.required,
} as const;

export const getPasswordErrorMessage = (password: string) => {
  if (password.length === 0) {
    return PASSWORD_ERROR_MESSAGES.required;
  }

  return undefined;
};
