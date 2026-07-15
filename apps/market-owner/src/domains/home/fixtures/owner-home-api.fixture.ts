import { type OwnerHomeResponseTypes } from '../model/owner-home-schema';

export const ownerHomeFixture = {
  todayRegisteredCount: 3,
  dailyCount: 1,
  dailyProducts: [
    {
      productId: 101,
      thumbnailUrl: 'https://cdn.example.com/products/daily-101.png',
      name: '삼겹살 500g',
      originalPrice: 6900,
      discountedPrice: 4900,
      discountRate: 29,
    },
  ],
  periodicCount: 1,
  periodicProducts: [
    {
      productId: 102,
      thumbnailUrl: 'https://cdn.example.com/products/periodic-102.png',
      name: '깻잎 2묶음',
      originalPrice: 3500,
      discountedPrice: 2900,
      discountRate: 17,
    },
  ],
  flyer: {
    flyerId: 11,
    slug: 'mangwon-fresh',
    qrCode: 'base64-qr-code',
  },
} satisfies OwnerHomeResponseTypes;
