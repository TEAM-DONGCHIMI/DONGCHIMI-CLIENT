import { describe, expect, it } from 'vitest';

import {
  EMAIL_ERROR_MESSAGES,
  getEmailErrorMessage,
  isAllowedEmailInputValue,
} from './email-validation';

describe('email-validation', () => {
  it('returns required error for an empty email', () => {
    expect(getEmailErrorMessage('')).toBe(EMAIL_ERROR_MESSAGES.required);
  });

  it('returns format error for emails without a valid domain', () => {
    expect(getEmailErrorMessage('example')).toBe(EMAIL_ERROR_MESSAGES.invalidFormat);
    expect(getEmailErrorMessage('example@email')).toBe(EMAIL_ERROR_MESSAGES.invalidFormat);
    expect(getEmailErrorMessage('example@email.')).toBe(EMAIL_ERROR_MESSAGES.invalidFormat);
  });

  it('accepts emails with supported domain formats', () => {
    expect(getEmailErrorMessage('example@email.com')).toBeUndefined();
    expect(getEmailErrorMessage('owner_01-test@example.co.kr')).toBeUndefined();
  });

  it('allows only english letters, numbers, and email-safe symbols', () => {
    expect(isAllowedEmailInputValue('owner_01-test@example.com')).toBe(true);
    expect(isAllowedEmailInputValue('owner@example.com ')).toBe(false);
    expect(isAllowedEmailInputValue('한글@example.com')).toBe(false);
    expect(isAllowedEmailInputValue('owner+tag@example.com')).toBe(false);
  });
});
