import type { ProductCardItemTypes } from './ProductCard';

export const productCardItemsFixture: ProductCardItemTypes[] = Array.from(
  { length: 6 },
  (_, index) => ({
    discountRate: 10,
    id: `product-${index + 1}`,
    name: `풀무원 콩나물 500g ${index + 1}`,
    originalPriceText: '5,000원',
    priceText: '4,500원',
    rank: index + 1,
  }),
);
