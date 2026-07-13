import { describe, expect, it } from 'vitest';

import {
  formatDiscountPeriodInput,
  getRegistrationResultFieldBlurValue,
  getRegistrationResultFieldInputValue,
  validateRegistrationResultProductFields,
  type RegistrationResultProductFieldValues,
} from './registration-result-product-validation';

const createFieldValues = (
  overrides: Partial<RegistrationResultProductFieldValues> = {},
): RegistrationResultProductFieldValues => ({
  category: '가공식품',
  discountPeriod: '2026-07-13 ~ 2026-07-20',
  price: '12900',
  productName: '포기김치 3kg',
  promotionText: '오늘만 특가',
  ...overrides,
});

describe('registration result product validation', () => {
  it('formats discount period digits and filters non-numeric price input', () => {
    expect(formatDiscountPeriodInput('2026071320260720')).toBe('2026-07-13 ~ 2026-07-20');
    expect(getRegistrationResultFieldInputValue('price', '12a,900원')).toBe('12900');
  });

  it('trims product name and promotion text on blur', () => {
    expect(getRegistrationResultFieldBlurValue('productName', '  포기김치  ')).toBe('포기김치');
    expect(getRegistrationResultFieldBlurValue('promotionText', '   ')).toBe('');
  });

  it('returns required errors for empty required fields', () => {
    const errors = validateRegistrationResultProductFields(
      createFieldValues({ discountPeriod: '', price: '', productName: '   ' }),
    );

    expect(errors).toMatchObject({
      discountPeriod: '할인 기간을 입력해주세요.',
      price: '가격을 입력해주세요.',
      productName: '상품명을 입력해주세요.',
    });
  });

  it('validates product name, price, and promotion text constraints', () => {
    const errors = validateRegistrationResultProductFields(
      createFieldValues({
        price: '12만원',
        productName: '1234567890123456',
        promotionText: '1234567890123456789012345678901',
      }),
    );

    expect(errors).toMatchObject({
      price: '가격은 숫자만 입력해주세요.',
      productName: '상품명은 공백 포함 15자 이하로 입력해주세요.',
      promotionText: '홍보문구는 공백 포함 30자 이하로 입력해주세요.',
    });
  });

  it('allows prices up to 100 million won', () => {
    expect(
      validateRegistrationResultProductFields(createFieldValues({ price: '100000000' })).price,
    ).toBeUndefined();
    expect(
      validateRegistrationResultProductFields(createFieldValues({ price: '100000001' })).price,
    ).toBe('1억원 이하로 입력하세요.');
    expect(
      validateRegistrationResultProductFields(createFieldValues({ price: '100,000,000' })).price,
    ).toBeUndefined();
  });

  it('rejects invalid calendar months and days', () => {
    expect(
      validateRegistrationResultProductFields(
        createFieldValues({ discountPeriod: '2026-02-30 ~ 2026-03-02' }),
      ).discountPeriod,
    ).toBe('올바른 날짜 형식으로 입력해주세요.');
    expect(
      validateRegistrationResultProductFields(
        createFieldValues({ discountPeriod: '2026-13-01 ~ 2026-13-02' }),
      ).discountPeriod,
    ).toBe('올바른 날짜 형식으로 입력해주세요.');
    expect(
      validateRegistrationResultProductFields(
        createFieldValues({ discountPeriod: '2026-04-31 ~ 2026-05-01' }),
      ).discountPeriod,
    ).toBe('올바른 날짜 형식으로 입력해주세요.');
  });

  it('rejects a period whose end date is before its start date', () => {
    expect(
      validateRegistrationResultProductFields(
        createFieldValues({ discountPeriod: '2026-07-20 ~ 2026-07-13' }),
      ).discountPeriod,
    ).toBe('종료일은 시작일 이후 날짜를 선택해주세요.');
  });

  it('allows the same start and end date', () => {
    const errors = validateRegistrationResultProductFields(
      createFieldValues({ discountPeriod: '2026-07-13 ~ 2026-07-13' }),
    );

    expect(errors.discountPeriod).toBeUndefined();
  });
});
