import { describe, expect, it } from 'vitest';

import { getVisibleFieldErrorMessage } from './form-error.utils';

describe('getVisibleFieldErrorMessage', () => {
  const error = { message: '필수 값입니다.', type: 'required' };

  it('returns undefined before submit or touch', () => {
    expect(
      getVisibleFieldErrorMessage({
        error,
        isSubmitted: false,
        isTouched: false,
      }),
    ).toBeUndefined();
  });

  it('returns an error message after submit', () => {
    expect(
      getVisibleFieldErrorMessage({
        error,
        isSubmitted: true,
        isTouched: false,
      }),
    ).toBe('필수 값입니다.');
  });

  it('returns an error message after touch', () => {
    expect(
      getVisibleFieldErrorMessage({
        error,
        isSubmitted: false,
        isTouched: true,
      }),
    ).toBe('필수 값입니다.');
  });
});
