export const PRODUCT_DETAIL_API_RESPONSE_FIXTURE = {
  code: 'SUCCESS',
  data: {
    dealType: 'DAILY',
    discountedPrice: 4500,
    discountEndDate: '2026-07-16',
    discountRate: 10,
    discountStartDate: '2026-07-16',
    marketName: '망원 신선마트',
    name: '삼겹살 500g',
    originalPrice: 5000,
    productId: 10,
    promotionalPhrase: '오늘 들어온 삼겹살입니다.',
    thumbnailUrl: 'https://cdn.test/products/samgyeopsal.png',
  },
  message: '요청에 성공했습니다.',
  success: true,
} as const;
