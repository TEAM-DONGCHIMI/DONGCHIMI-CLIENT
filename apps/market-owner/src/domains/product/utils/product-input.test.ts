import { describe, expect, it } from 'vitest';

import {
  formatProductPriceInput,
  limitProductNameInput,
  limitProductPromotionTextInput,
} from './product-input';

describe('product input', () => {
  it('limits product names to 15 characters including spaces', () => {
    expect(limitProductNameInput('12345 7890123456')).toBe('12345 789012345');
  });

  it('limits promotion text to 25 characters including spaces', () => {
    expect(limitProductPromotionTextInput('1234567890 1234567890 12345')).toBe(
      '1234567890 1234567890 123',
    );
  });

  it('keeps only price digits and formats thousands separators', () => {
    expect(formatProductPriceInput('가격1234원')).toBe('1,234');
  });
});
