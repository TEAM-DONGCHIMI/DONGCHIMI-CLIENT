import { HttpResponse, http, passthrough } from 'msw';

import { type GetProductListResponseTypes } from '@/domains/product/api/get-product-list';

const eventDiscountProductListResponse = {
  success: true,
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  data: {
    content: [
      {
        productId: 101,
        name: '삼겹살 500g',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
        category: 'MEAT_EGG',
        categoryName: '정육/달걀',
        originalPrice: 5000,
        discountedPrice: 4500,
        promotionalPhrase: '이번 주 한정 특가',
        discountStartDate: '2026-08-16',
        discountEndDate: '2026-08-22',
        viewCount: 162,
        createdAt: '2026-08-15T10:00:00',
      },
      {
        productId: 102,
        name: '고등어 2마리',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/102.png',
        category: 'SEAFOOD',
        categoryName: '수산물',
        originalPrice: 8000,
        discountedPrice: 6900,
        promotionalPhrase: null,
        discountStartDate: '2026-08-16',
        discountEndDate: '2026-08-20',
        viewCount: 88,
        createdAt: '2026-08-14T09:30:00',
      },
    ],
    hasNext: true,
    nextCursor: 101,
  },
} satisfies GetProductListResponseTypes;

export const handlers = [
  http.get('*/v1/owners/markets/:marketId/products', ({ params, request }) => {
    const { searchParams } = new URL(request.url);
    const isEventDiscountRequest =
      params.marketId === '1' && searchParams.get('type') === 'PERIODIC';

    if (!isEventDiscountRequest) {
      return passthrough();
    }

    return HttpResponse.json(eventDiscountProductListResponse);
  }),
];
