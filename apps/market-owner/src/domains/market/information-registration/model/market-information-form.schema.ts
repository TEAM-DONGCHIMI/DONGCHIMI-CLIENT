import { z } from 'zod';

import {
  isValidBusinessDay,
  isValidBusinessRegistrationNumber,
  isValidBusinessTime,
  isValidMarketPhone,
  isValidOwnerPhone,
} from './market-information-form.utils';

const marketNameErrorMessages = {
  empty: '마트명을 입력해주세요.',
  startsWithSpace: '마트명은 공백으로 시작할 수 없습니다.',
} as const;

const businessRegistrationNumberErrorMessage = '올바른 사업자등록번호를 입력해주세요.';
const addressErrorMessage = '주소를 입력해주세요.';
const addressDetailErrorMessage = '상세 주소를 입력해주세요.';
const businessOperationErrorMessage = '올바른 형식으로 입력 해주세요.';
const marketPhoneErrorMessages = {
  empty: '대표 전화번호를 입력해주세요.',
  invalid: '올바른 전화번호를 입력해주세요.',
} as const;
const ownerPhoneErrorMessages = {
  empty: '점주 휴대전화 번호를 입력해주세요.',
  invalid: '올바른 휴대전화 번호를 입력해주세요.',
} as const;

const requiredString = (message: string) =>
  z.string().refine((value) => value.trim().length > 0, { message });

export const marketInformationRegistrationSchema = z
  .object({
    additionalBusinessDay: z.string(),
    additionalBusinessTime: z.string(),
    address: requiredString(addressErrorMessage),
    addressDetail: requiredString(addressDetailErrorMessage).max(20, addressDetailErrorMessage),
    businessDay: z.string().refine(isValidBusinessDay, {
      message: businessOperationErrorMessage,
    }),
    businessRegistrationNumber: z.string().refine(isValidBusinessRegistrationNumber, {
      message: businessRegistrationNumberErrorMessage,
    }),
    businessTime: z.string().refine(isValidBusinessTime, {
      message: businessOperationErrorMessage,
    }),
    holiday: z.string(),
    marketName: requiredString(marketNameErrorMessages.empty)
      .max(15)
      .refine((marketName) => !marketName.startsWith(' '), {
        message: marketNameErrorMessages.startsWithSpace,
      }),
    marketPhone: requiredString(marketPhoneErrorMessages.empty).refine(isValidMarketPhone, {
      message: marketPhoneErrorMessages.invalid,
    }),
    ownerPhone: requiredString(ownerPhoneErrorMessages.empty).refine(isValidOwnerPhone, {
      message: ownerPhoneErrorMessages.invalid,
    }),
  })
  .superRefine(({ additionalBusinessDay, additionalBusinessTime }, context) => {
    const hasAdditionalBusinessDay = additionalBusinessDay.trim().length > 0;
    const hasAdditionalBusinessTime = additionalBusinessTime.trim().length > 0;

    if (!hasAdditionalBusinessDay && !hasAdditionalBusinessTime) {
      return;
    }

    if (!hasAdditionalBusinessDay || !isValidBusinessDay(additionalBusinessDay)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessOperationErrorMessage,
        path: ['additionalBusinessDay'],
      });
    }

    if (!hasAdditionalBusinessTime || !isValidBusinessTime(additionalBusinessTime)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessOperationErrorMessage,
        path: ['additionalBusinessTime'],
      });
    }
  });
