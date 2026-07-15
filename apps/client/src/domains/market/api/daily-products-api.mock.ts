export const DAILY_PRODUCTS_API_RESPONSE_FIXTURE = {
  code: 'SUCCESS',
  data: {
    products: [
      {
        discountRate: 10,
        discountedPrice: 4500,
        name: '풀무원 콩나물 500g',
        originalPrice: 5000,
        productId: 201,
        thumbnailUrl: 'https://cdn.example.com/products/201.png',
      },
      {
        discountRate: 20,
        discountedPrice: 3200,
        name: '유기농 두부 300g',
        originalPrice: 4000,
        productId: 202,
        thumbnailUrl: null,
      },
    ],
    totalCount: 2,
  },
  message: '요청에 성공했습니다.',
  success: true,
} as const;
