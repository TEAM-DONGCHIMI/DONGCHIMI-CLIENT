import { type OwnerProductSortTypes } from '@dongchimi/shared/api';

import { type OwnerApiTypes } from '@/shared/api';
import { type ProductEditFilterTypes } from '../components/product-edit-page-shell';
import { type ProductSelectableCategoryTypes } from '../constants';

const productCategoryNameByCode = {
  VEGETABLE_FRUIT: '채소･과일',
  MEAT_EGG: '정육･달걀',
  SEAFOOD: '수산',
  DAIRY: '유제품',
  CONVENIENCE_FOOD: '간편식',
  PROCESSED_FOOD: '가공식품',
  BEVERAGE_ALCOHOL: '음료･주류',
  HOUSEHOLD_GOODS: '생활용품',
  ETC: '기타',
} satisfies Record<
  OwnerApiTypes.OwnerProductListItemResponse['category'],
  ProductSelectableCategoryTypes
>;

const productListSortByFilter = {
  category: 'CATEGORY',
  registered: 'LATEST',
  views: 'VIEW_COUNT',
} satisfies Record<ProductEditFilterTypes, OwnerProductSortTypes>;

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};

const formatRegisteredDateLabel = (createdAt: string) => {
  const [date] = createdAt.split('T');
  const [year, month, day] = date.split('-');

  if (year == null || month == null || day == null) {
    return createdAt;
  }

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const calculateDiscountRate = (originalPrice: number, discountedPrice: number) => {
  if (originalPrice <= 0) {
    return undefined;
  }

  return String(Math.max(0, Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)));
};

export const getProductListSort = (filter: ProductEditFilterTypes) => {
  return productListSortByFilter[filter];
};

export const createProductEditListItem = (product: OwnerApiTypes.OwnerProductListItemResponse) => {
  return {
    categoryName: productCategoryNameByCode[product.category],
    endDate: product.discountEndDate,
    originalPrice: formatPrice(product.originalPrice),
    productId: product.productId,
    productName: product.name,
    registeredAt: product.createdAt,
    registeredDateLabel: formatRegisteredDateLabel(product.createdAt),
    salePercent: calculateDiscountRate(product.originalPrice, product.discountedPrice),
    salePrice: formatPrice(product.discountedPrice),
    startDate: product.discountStartDate,
    viewCount: product.viewCount,
  };
};

export type ProductEditListItemTypes = ReturnType<typeof createProductEditListItem>;
