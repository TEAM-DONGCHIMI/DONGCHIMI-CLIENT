import { API_ENDPOINTS, ApiResponseValidationError } from '@dongchimi/shared/api';
import { HttpResponse, http } from 'msw';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/test';
import { getProductDetail } from './product-detail-api';

const API_BASE_URL = 'https://api.test';
const PRODUCT_DETAIL_ENDPOINT = API_ENDPOINTS.user.products.detail(1, 10);

describe('getProductDetail', () => {
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', API_BASE_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('상품 상세 API 응답을 오늘의 특가 화면 모델로 변환한다', async () => {
    server.use(
      http.get(`${API_BASE_URL}${PRODUCT_DETAIL_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '성공',
          data: {
            productId: 10,
            name: '삼겹살 500g',
            dealType: 'DAILY',
            thumbnailUrl: 'https://cdn.test/products/samgyeopsal.png',
            originalPrice: 5000,
            discountedPrice: 4500,
            discountRate: 10,
            promotionalPhrase: '오늘 들어온 삼겹살입니다.',
            discountStartDate: '2026-07-10',
            discountEndDate: '2026-07-10',
            marketName: '망원 신선마트',
          },
        });
      }),
    );

    const result = await getProductDetail({ marketId: '1', productId: '10' });

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
      http.get(`${API_BASE_URL}${PRODUCT_DETAIL_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '성공',
          data: {
            productId: 10,
            name: '딸기 1팩',
            dealType: 'PERIODIC',
            thumbnailUrl: null,
            originalPrice: 12000,
            discountedPrice: 9900,
            discountRate: 18,
            promotionalPhrase: null,
            discountStartDate: '2026-07-10',
            discountEndDate: '2026-07-12',
            marketName: '망원 신선마트',
          },
        });
      }),
    );

    const result = await getProductDetail({ marketId: '1', productId: '10' });

    expect(result).toMatchObject({
      headerTitle: '행사 할인 상품',
      imageAlt: '딸기 1팩 상품 이미지',
      imageUrl: undefined,
      martComment: undefined,
      productName: '딸기 1팩',
      promotion: {
        periodText: '7.10 ~ 7.12',
        salePriceText: '9,900원',
        type: 'event-discount',
      },
      promotionLabel: '행사 할인 품목',
    });
  });

  it('data가 null이면 null을 반환한다', async () => {
    server.use(
      http.get(`${API_BASE_URL}${PRODUCT_DETAIL_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '성공',
          data: null,
        });
      }),
    );

    await expect(getProductDetail({ marketId: '1', productId: '10' })).resolves.toBeNull();
  });

  it('응답 계약이 다르면 validation error를 던진다', async () => {
    server.use(
      http.get(`${API_BASE_URL}${PRODUCT_DETAIL_ENDPOINT}`, () => {
        return HttpResponse.json({
          success: true,
          code: 'SUCCESS',
          message: '성공',
          data: {
            productId: '10',
          },
        });
      }),
    );

    await expect(getProductDetail({ marketId: '1', productId: '10' })).rejects.toThrow(
      ApiResponseValidationError,
    );
  });
});
