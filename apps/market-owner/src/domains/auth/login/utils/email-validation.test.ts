import { describe, expect, it } from 'vitest';

import { EMAIL_ERROR_MESSAGES, getEmailErrorMessage } from './email-validation';

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

  it('returns format error for emails with Korean characters or unsupported symbols', () => {
    expect(getEmailErrorMessage('한글@example.com')).toBe(EMAIL_ERROR_MESSAGES.invalidFormat);
    expect(getEmailErrorMessage('owner+tag@example.com')).toBe(EMAIL_ERROR_MESSAGES.invalidFormat);
  });
});
