import { ApiResponseValidationError } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test';
import { getProductDetail } from './product-detail-api';
import { PRODUCT_DETAIL_API_RESPONSE_FIXTURE } from './product-detail-api.mock';

const PRODUCT_DETAIL_ENDPOINT = `${window.location.origin}/api/products/10?marketId=1`;

describe('getProductDetail', () => {
  it('same-origin BFF 응답을 오늘의 특가 화면 모델로 변환한다', async () => {
    server.use(
      http.get(PRODUCT_DETAIL_ENDPOINT, () => {
        return HttpResponse.json(PRODUCT_DETAIL_API_RESPONSE_FIXTURE);
      }),
    );

    const result = await getProductDetail({ marketId: 1, productId: '10' });

    expect(result).toEqual({
      headerTitle: '오늘의 특가',
      imageAlt: '삼겹살 500g 상품 이미지',
      imageUrl: 'https://cdn.test/products/samgyeopsal.png',
      marketName: '망원 신선마트',
      martComment: '오늘 들어온 삼겹살입니다.',
      productName: '삼겹살 500g',
      promotion: {
        discountRateText: '10%',
        originalPriceText: '5,000원',
        salePriceText: '4,500원',
        type: 'today-special',
      },
      promotionLabel: '오늘의 특가',
    });
  });

  it('행사 할인 상품 응답은 기간 chip 모델로 변환한다', async () => {
    server.use(
      http.get(PRODUCT_DETAIL_ENDPOINT, () => {
        return HttpResponse.json({
          ...PRODUCT_DETAIL_API_RESPONSE_FIXTURE,
          data: {
            ...PRODUCT_DETAIL_API_RESPONSE_FIXTURE.data,
            dealType: 'PERIODIC',
            discountEndDate: '2026-07-18',
            promotionalPhrase: null,
            thumbnailUrl: null,
          },
        });
      }),
    );

    const result = await getProductDetail({ marketId: 1, productId: '10' });

    expect(result).toMatchObject({
      headerTitle: '행사 할인 상품',
      imageUrl: undefined,
      martComment: undefined,
      promotion: {
        periodText: '7.16 ~ 7.18',
        salePriceText: '4,500원',
        type: 'event-discount',
      },
      promotionLabel: '행사 할인 품목',
    });
  });

  it('data가 null이면 null을 반환한다', async () => {
    server.use(
      http.get(PRODUCT_DETAIL_ENDPOINT, () => {
        return HttpResponse.json({
          ...PRODUCT_DETAIL_API_RESPONSE_FIXTURE,
          data: null,
        });
      }),
    );

    await expect(getProductDetail({ marketId: 1, productId: '10' })).resolves.toBeNull();
  });

  it('응답 계약이 다르면 validation error를 던진다', async () => {
    server.use(
      http.get(PRODUCT_DETAIL_ENDPOINT, () => {
        return HttpResponse.json({
          ...PRODUCT_DETAIL_API_RESPONSE_FIXTURE,
          data: {
            productId: '10',
          },
        });
      }),
    );

    await expect(getProductDetail({ marketId: 1, productId: '10' })).rejects.toThrow(
      ApiResponseValidationError,
    );
  });

  it('식별자가 유효하지 않으면 browser 요청 전에 validation error를 던진다', async () => {
    await expect(getProductDetail({ marketId: undefined, productId: '10' })).rejects.toMatchObject({
      name: 'ZodError',
    });
  });
});
