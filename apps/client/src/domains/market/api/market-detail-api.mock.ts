export const MARKET_DETAIL_API_RESPONSE_FIXTURE = {
  code: 'SUCCESS',
  data: {
    address: '서울시 마포구 망원동',
    businessHours: [
      {
        close: '18:00',
        days: ['MONDAY', 'TUESDAY'],
        isOpen: true,
        open: '13:00',
      },
      {
        close: null,
        days: ['SUNDAY'],
        isOpen: false,
        open: null,
      },
    ],
    isHolidayClosed: false,
    isOpenNow: true,
    marketId: 1,
    marketPhone1: '02-123-4567',
    marketPhone2: null,
    name: '망원 신선마트',
    ownerPhone: '02-123-1234',
    thumbnailUrl: null,
    top3: [
      {
        discountedPrice: 6900,
        discountRate: 10,
        name: '삼겹살 500g',
        productId: 101,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 5900,
        discountRate: 15,
        name: '목살 500g',
        productId: 102,
        thumbnailUrl: null,
      },
      {
        discountedPrice: 3900,
        discountRate: 5,
        name: '앞다리살 500g',
        productId: 103,
        thumbnailUrl: null,
      },
    ],
  },
  message: '요청에 성공했습니다.',
  success: true,
} as const;
