import { AUTH_EMAIL_ERROR_MESSAGES } from '../../constants/auth-messages';
import { AUTH_EMAIL_ALLOWED_CHARACTERS_PATTERN } from '../../constants/auth-patterns';

export const SIGNUP_EMAIL_ERROR_MESSAGES = {
  duplicated: '이미 사용 중인 이메일입니다.',
  format: AUTH_EMAIL_ERROR_MESSAGES.format,
  required: AUTH_EMAIL_ERROR_MESSAGES.required,
} as const;

export const SIGNUP_EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.(?:com|co\.kr)$/;
export const SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN = AUTH_EMAIL_ALLOWED_CHARACTERS_PATTERN;

const USED_SIGNUP_EMAILS = new Set(['used@example.com', 'owner@email.co.kr']);

export const isUsedSignupEmail = (email: string) => {
  return USED_SIGNUP_EMAILS.has(email.toLowerCase());
};
