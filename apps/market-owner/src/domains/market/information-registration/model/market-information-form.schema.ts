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
const businessOperationErrorMessages = {
  empty: '영업 요일과 영업시간을 입력해주세요.',
  invalidTime: '올바른 시간을 입력해주세요.',
} as const;
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
    brn: z.string().refine(isValidBusinessRegistrationNumber, {
      message: businessRegistrationNumberErrorMessage,
    }),
    businessDay: z.string().refine(isValidBusinessDay, {
      message: businessOperationErrorMessages.empty,
    }),
    businessTime: requiredString(businessOperationErrorMessages.empty).refine(
      (businessTime) => businessTime.trim().length === 0 || isValidBusinessTime(businessTime),
      {
        message: businessOperationErrorMessages.invalidTime,
      },
    ),
    detailAddress: requiredString(addressDetailErrorMessage).max(20, addressDetailErrorMessage),
    holiday: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    marketPhone1: requiredString(marketPhoneErrorMessages.empty).refine(isValidMarketPhone, {
      message: marketPhoneErrorMessages.invalid,
    }),
    marketPhone2: z.string().nullable(),
    marketPhonePrimary: z.literal(1).or(z.literal(2)),
    name: requiredString(marketNameErrorMessages.empty)
      .max(15)
      .refine((name) => !name.startsWith(' '), {
        message: marketNameErrorMessages.startsWithSpace,
      }),
    ownerPhone: requiredString(ownerPhoneErrorMessages.empty).refine(isValidOwnerPhone, {
      message: ownerPhoneErrorMessages.invalid,
    }),
    thumbnailUrl: z.string().nullable(),
  })
  .superRefine(({ additionalBusinessDay, additionalBusinessTime }, context) => {
    const hasAdditionalBusinessDay = additionalBusinessDay.trim().length > 0;
    const hasAdditionalBusinessTime = additionalBusinessTime.trim().length > 0;

    if (!hasAdditionalBusinessDay && !hasAdditionalBusinessTime) {
      return;
    }

    if (!hasAdditionalBusinessDay) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessOperationErrorMessages.empty,
        path: ['additionalBusinessDay'],
      });
    }

    if (!hasAdditionalBusinessTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessOperationErrorMessages.empty,
        path: ['additionalBusinessTime'],
      });

      return;
    }

    if (!isValidBusinessTime(additionalBusinessTime)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessOperationErrorMessages.invalidTime,
        path: ['additionalBusinessTime'],
      });
    }
  });
