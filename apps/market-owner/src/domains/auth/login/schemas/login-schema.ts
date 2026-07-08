import { type Resolver } from 'react-hook-form';
import { z } from 'zod';

import {
  EMAIL_ERROR_MESSAGES,
  EMAIL_PATTERN,
  isAllowedEmailInputValue,
} from '../utils/email-validation';
import { PASSWORD_ERROR_MESSAGES } from '../utils/password-validation';

export const loginSchema = z.object({
  email: z.string().superRefine((email, context) => {
    if (email.length === 0) {
      context.addIssue({
        code: 'custom',
        message: EMAIL_ERROR_MESSAGES.required,
      });

      return;
    }

    if (!isAllowedEmailInputValue(email) || !EMAIL_PATTERN.test(email)) {
      context.addIssue({
        code: 'custom',
        message: EMAIL_ERROR_MESSAGES.invalidFormat,
      });
    }
  }),
  isAutoLogin: z.boolean(),
  password: z.string().min(1, PASSWORD_ERROR_MESSAGES.required),
});

export type LoginFormTypes = z.infer<typeof loginSchema>;

export const LOGIN_FORM_DEFAULT_VALUES = {
  email: '',
  isAutoLogin: false,
  password: '',
} satisfies LoginFormTypes;

export const loginFormResolver: Resolver<LoginFormTypes> = (values) => {
  const result = loginSchema.safeParse(values);

  if (result.success) {
    return {
      errors: {},
      values: result.data,
    };
  }

  return {
    errors: Object.fromEntries(
      result.error.issues.map((issue) => [
        issue.path[0],
        {
          message: issue.message,
          type: issue.code,
        },
      ]),
    ),
    values: {},
  };
};
