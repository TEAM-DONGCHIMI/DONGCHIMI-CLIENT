import { describe, expect, it } from 'vitest';

import { getPasswordErrorMessage, PASSWORD_ERROR_MESSAGES } from './password-validation';

describe('password-validation', () => {
  it('returns required error for an empty password', () => {
    expect(getPasswordErrorMessage('')).toBe(PASSWORD_ERROR_MESSAGES.required);
  });

  it('accepts a non-empty password', () => {
    expect(getPasswordErrorMessage('password')).toBeUndefined();
  });
});
