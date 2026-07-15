import { type OwnerProductSortTypes } from '@dongchimi/shared/api';

import { type OwnerApiTypes } from '@/shared/api';
import { PRODUCT_CATEGORY_NAME_BY_CODE } from '@/shared/constants/product-categories';
import { type ProductEditFilterTypes } from '../components/product-edit-page-shell';

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
    categoryName: PRODUCT_CATEGORY_NAME_BY_CODE[product.category],
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

export const createProductEditListStateKey = (products: readonly ProductEditListItemTypes[]) =>
  JSON.stringify(products);
