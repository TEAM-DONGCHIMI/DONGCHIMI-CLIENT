import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  SIGNUP_EMAIL_ALLOWED_CHARACTERS_PATTERN,
  SIGNUP_EMAIL_ERROR_MESSAGES,
  SIGNUP_EMAIL_PATTERN,
} from '../utils/email-validation';
import {
  MAX_SIGNUP_PASSWORD_LENGTH,
  MIN_SIGNUP_PASSWORD_LENGTH,
  SIGNUP_PASSWORD_CONFIRM_ERROR_MESSAGES,
  SIGNUP_PASSWORD_ERROR_MESSAGES,
} from '../utils/password-validation';
import { KOREAN_CHARACTERS_PATTERN, WHITESPACE_PATTERN } from '../utils/text-pattern';

export const SIGNUP_FORM_DEFAULT_VALUES = {
  email: '',
  password: '',
  passwordConfirm: '',
} as const;

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
      .refine((email) => SIGNUP_EMAIL_PATTERN.test(email), SIGNUP_EMAIL_ERROR_MESSAGES.format),
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
