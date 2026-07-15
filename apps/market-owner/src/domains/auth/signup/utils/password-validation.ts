import { AUTH_PASSWORD_ERROR_MESSAGES } from '../../constants/auth-messages';

export const SIGNUP_PASSWORD_ERROR_MESSAGES = {
  korean: '한글은 사용할 수 없습니다.',
  length: '6~20자로 입력해주세요.',
  required: AUTH_PASSWORD_ERROR_MESSAGES.required,
  whitespace: '공백은 사용할 수 없습니다.',
} as const;

export const SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES = {
  mismatch: '비밀번호가 일치하지 않습니다.',
  required: '비밀번호를 다시 입력해주세요.',
} as const;

export const MIN_SIGNUP_PASSWORD_LENGTH = 6;
export const MAX_SIGNUP_PASSWORD_LENGTH = 20;
