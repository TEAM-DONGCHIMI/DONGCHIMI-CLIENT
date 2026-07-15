import { describe, expect, it } from 'vitest';

import {
  createPreparedProductDraftSaveRequest,
  createRegistrationResultProduct,
} from './registration-result-product';

describe('registration result product model', () => {
  it('maps a prepared draft response to the registration result row model', () => {
    expect(
      createRegistrationResultProduct({
        preparedProductId: 12,
        name: '삼겹살 500g',
        thumbnailUrl: 'https://static.dongchimi.kr/test.png',
        discountedPrice: 4000,
        category: 'MEAT_EGG',
        promotionalPhrase: '맛이 미쳤어요',
        discountStartDate: '2026-07-15',
        discountEndDate: '2026-07-21',
        draftStatus: 'SUCCESS',
        failReason: null,
      }),
    ).toEqual({
      category: '정육/달걀',
      discountPeriod: '2026-07-15 ~ 2026-07-21',
      id: '12',
      imageAlt: '삼겹살 500g 이미지',
      imageUrl: 'https://static.dongchimi.kr/test.png',
      price: '4000',
      productName: '삼겹살 500g',
      promotionText: '맛이 미쳤어요',
      status: 'completed',
      statusReason: undefined,
    });
  });

  it('creates a prepared draft save request from edited row drafts', () => {
    const request = createPreparedProductDraftSaveRequest({
      productImageUrls: new Map([['12', 'https://static.dongchimi.kr/uploaded.png']]),
      products: [
        {
          category: '수산물',
          discountPeriod: '2026-07-15 ~ 2026-07-21',
          id: '12',
          imageUrl: 'https://static.dongchimi.kr/test.png',
          price: '4000',
          productName: '고등어',
          promotionText: '맛이 미쳤어요',
          status: 'needsEdit',
          statusReason: '이미지 누락',
        },
      ],
      productDrafts: new Map([
        [
          '12',
          {
            category: '정육/달걀',
            price: '4,500원',
            promotionText: '  오늘만 특가  ',
          },
        ],
      ]),
    });

    expect(request).toEqual({
      preparedProducts: [
        {
          preparedProductId: 12,
          name: '고등어',
          thumbnailUrl: 'https://static.dongchimi.kr/uploaded.png',
          discountedPrice: 4500,
          category: 'MEAT_EGG',
          promotionalPhrase: '오늘만 특가',
          discountStartDate: '2026-07-15',
          discountEndDate: '2026-07-21',
          dealType: 'PERIODIC',
        },
      ],
    });
  });
});
