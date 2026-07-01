import { type ProductCardItemTypes } from './ProductCard.types';

export const DEFAULT_VISIBLE_COUNT = 4;

export const formatProductCardCount = (count: number) => {
  return new Intl.NumberFormat('ko-KR').format(count);
};

export const getProductCardBadgeLabel = (item: ProductCardItemTypes) => {
  if (item.badgeLabel) {
    return item.badgeLabel;
  }

  if (typeof item.discountRate === 'number') {
    return `${item.discountRate}%`;
  }

  return undefined;
};
