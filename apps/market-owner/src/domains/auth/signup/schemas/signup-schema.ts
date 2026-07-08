import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const SIGNUP_EMAIL_ERROR_MESSAGES = {
  duplicated: '이미 사용 중인 이메일입니다.',
  format: '올바른 이메일 형식이 아닙니다.',
  required: '이메일을 입력해주세요.',
} as const;

export const SIGNUP_PASSWORD_ERROR_MESSAGES = {
  format: '6-20자로 입력해주세요.',
  required: '비밀번호를 입력해주세요.',
} as const;

export const SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES = {
  mismatch: '비밀번호가 일치하지 않습니다.',
  required: '비밀번호를 다시 입력해주세요.',
} as const;

export const SIGNUP_FORM_DEFAULT_VALUES = {
  email: '',
  password: '',
  passwordConfirm: '',
} as const;

export const SIGNUP_EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.(?:com|co\.kr)$/;
export const SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN = /^[A-Za-z0-9@._-]*$/;
const KOREAN_CHARACTERS_PATTERN = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
const WHITESPACE_PATTERN = /\s/;
const MIN_SIGNUP_PASSWORD_LENGTH = 6;
const MAX_SIGNUP_PASSWORD_LENGTH = 20;
const USED_SIGNUP_EMAILS = new Set(['used@example.com', 'owner@email.co.kr']);

const isUsedSignupEmail = (email: string) => {
  return USED_SIGNUP_EMAILS.has(email.toLowerCase());
};

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, SIGNUP_EMAIL_ERROR_MESSAGES.required)
      .refine((email) => !WHITESPACE_PATTERN.test(email), SIGNUP_EMAIL_ERROR_MESSAGES.format)
      .refine((email) => !KOREAN_CHARACTERS_PATTERN.test(email), SIGNUP_EMAIL_ERROR_MESSAGES.format)
      .refine(
        (email) => SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN.test(email),
        SIGNUP_EMAIL_ERROR_MESSAGES.format,
      )
      .refine((email) => SIGNUP_EMAIL_PATTERN.test(email), SIGNUP_EMAIL_ERROR_MESSAGES.format)
      .refine((email) => !isUsedSignupEmail(email), SIGNUP_EMAIL_ERROR_MESSAGES.duplicated),
    password: z
      .string()
      .min(1, SIGNUP_PASSWORD_ERROR_MESSAGES.required)
      .min(MIN_SIGNUP_PASSWORD_LENGTH, SIGNUP_PASSWORD_ERROR_MESSAGES.format)
      .max(MAX_SIGNUP_PASSWORD_LENGTH, SIGNUP_PASSWORD_ERROR_MESSAGES.format)
      .refine(
        (password) => !WHITESPACE_PATTERN.test(password),
        SIGNUP_PASSWORD_ERROR_MESSAGES.format,
      )
      .refine(
        (password) => !KOREAN_CHARACTERS_PATTERN.test(password),
        SIGNUP_PASSWORD_ERROR_MESSAGES.format,
      ),
    passwordConfirm: z.string().min(1, SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES.required),
  })
  .refine((form) => form.passwordConfirm === form.password, {
    message: SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES.mismatch,
    path: ['passwordConfirm'],
  });

export type SignupFormTypes = z.infer<typeof signupSchema>;

export type SignupOwnerRegisterRequestTypes = Pick<SignupFormTypes, 'email' | 'password'>;

export interface SignupOwnerRegisterSuccessResponseTypes {
  code: 'SUCCESS';
  data: {
    email: string;
    ownerId: number;
  };
  message: string;
  success: true;
}

export interface SignupOwnerRegisterErrorResponseTypes {
  code: 'DUPLICATE_EMAIL' | 'INVALID_INPUT';
  message: string;
  success: false;
}

export type SignupOwnerRegisterResponseTypes =
  | SignupOwnerRegisterSuccessResponseTypes
  | SignupOwnerRegisterErrorResponseTypes;

export const signupFormResolver = zodResolver(signupSchema);
