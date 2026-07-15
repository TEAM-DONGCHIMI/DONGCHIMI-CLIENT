import type { UserApiTypes } from '@/shared/api';

export const PERIODIC_PRODUCTS_FIRST_PAGE_RESPONSE_FIXTURE = {
  code: 'SUCCESS',
  data: {
    availableCategories: ['VEGETABLE_FRUIT', 'MEAT_EGG', 'SEAFOOD'],
    content: [
      {
        discountedPrice: 4900,
        name: '삼겹살 500G',
        productId: 301,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 5900,
        name: '대추방울토마토 500G',
        productId: 302,
        thumbnailUrl: null,
      },
    ],
    hasNext: true,
    nextCursor: 302,
  },
  message: '요청에 성공했습니다.',
  success: true,
} satisfies UserApiTypes.ApiResponseCursorSliceResponsePeriodicProductResponse;

export const PERIODIC_PRODUCTS_LAST_PAGE_RESPONSE_FIXTURE = {
  code: 'SUCCESS',
  data: {
    availableCategories: ['VEGETABLE_FRUIT', 'MEAT_EGG', 'SEAFOOD'],
    content: [
      {
        discountedPrice: 3900,
        name: '양배추 1통',
        productId: 303,
        thumbnailUrl: null,
      },
    ],
    hasNext: false,
    nextCursor: null,
  },
  message: '요청에 성공했습니다.',
  success: true,
} satisfies UserApiTypes.ApiResponseCursorSliceResponsePeriodicProductResponse;
