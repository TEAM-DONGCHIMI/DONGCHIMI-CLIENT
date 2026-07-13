import { describe, expect, it } from 'vitest';

import { marketInformationRegistrationFixture } from '../fixtures';
import { marketInformationRegistrationSchema } from './market-information-form.schema';

const validForm = {
  ...marketInformationRegistrationFixture.initialForm,
  address: '서울특별시 마포구 월드컵로 123',
  businessDay: '월요일',
  businessTime: '09:00 - 18:00',
  detailAddress: '101호',
  marketPhone1: '02-1234-5678',
  name: '동치미 마트',
  ownerPhone: '010-1234-5678',
};

describe('marketInformationRegistrationSchema', () => {
  it('추가 영업 시간 row가 열리면 요일과 시간을 필수로 검증한다', () => {
    const result = marketInformationRegistrationSchema.safeParse({
      ...validForm,
      hasAdditionalBusinessHours: true,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.additionalBusinessDay).toContain(
        '영업 요일과 영업시간을 입력해주세요.',
      );
      expect(result.error.flatten().fieldErrors.additionalBusinessTime).toContain(
        '영업 요일과 영업시간을 입력해주세요.',
      );
    }
  });

  it('추가 마트 번호 row가 열리면 번호를 필수로 검증한다', () => {
    const result = marketInformationRegistrationSchema.safeParse({
      ...validForm,
      hasAdditionalMarketPhone: true,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.marketPhone2).toBeDefined();
    }
  });
});
