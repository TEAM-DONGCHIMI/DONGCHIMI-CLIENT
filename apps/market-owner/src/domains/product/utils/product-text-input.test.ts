import { describe, expect, it } from 'vitest';

import { limitProductNameInput, limitProductPromotionTextInput } from './product-text-input';

describe('product text input limits', () => {
  it('limits product names to 15 characters including spaces', () => {
    expect(limitProductNameInput('12345 7890123456')).toBe('12345 789012345');
  });

  it('limits promotion text to 25 characters including spaces', () => {
    expect(limitProductPromotionTextInput('1234567890 1234567890 12345')).toBe(
      '1234567890 1234567890 123',
    );
  });
});
