import { AUTH_EMAIL_ERROR_MESSAGES } from '../../constants/auth-messages';
import { AUTH_EMAIL_ALLOWED_CHARACTERS_PATTERN } from '../../constants/auth-patterns';

export const SIGNUP_EMAIL_ERROR_MESSAGES = {
  format: AUTH_EMAIL_ERROR_MESSAGES.format,
  required: AUTH_EMAIL_ERROR_MESSAGES.required,
} as const;

export const SIGNUP_EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.(?:com|co\.kr)$/;
export const SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN = AUTH_EMAIL_ALLOWED_CHARACTERS_PATTERN;
