import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getEmailErrorMessage } from '../utils/email-validation';
import { PASSWORD_ERROR_MESSAGES } from '../utils/password-validation';

export const loginSchema = z.object({
  email: z.string().superRefine((email, context) => {
    const message = getEmailErrorMessage(email);

    if (message) {
      context.addIssue({
        code: 'custom',
        message,
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

export const loginFormResolver = zodResolver(loginSchema);
