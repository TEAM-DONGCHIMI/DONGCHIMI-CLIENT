import type { OwnerApiTypes } from '@/shared/api';

export const PRODUCT_CATEGORY_ALL_OPTION = '전체';

type ProductCategoryCodeTypes = OwnerApiTypes.OwnerProductListItemResponse['category'];

export const PRODUCT_CATEGORY_NAME_BY_CODE = {
  VEGETABLE_FRUIT: '채소/과일',
  MEAT_EGG: '정육/달걀',
  SEAFOOD: '수산물',
  DAIRY: '유제품',
  CONVENIENCE_FOOD: '간편식',
  PROCESSED_FOOD: '가공식품',
  BEVERAGE_ALCOHOL: '음료/주류',
  HOUSEHOLD_GOODS: '생활용품',
  ETC: '기타',
} as const satisfies Record<ProductCategoryCodeTypes, string>;

export type ProductCategoryGroupTypes =
  (typeof PRODUCT_CATEGORY_NAME_BY_CODE)[ProductCategoryCodeTypes];

export const PRODUCT_CATEGORY_GROUP_OPTIONS = Object.values(PRODUCT_CATEGORY_NAME_BY_CODE);

export const PRODUCT_CATEGORY_FILTER_OPTIONS = [
  PRODUCT_CATEGORY_ALL_OPTION,
  ...PRODUCT_CATEGORY_GROUP_OPTIONS,
] as const;

export const PRODUCT_CATEGORY_CODE_BY_NAME = Object.fromEntries(
  Object.entries(PRODUCT_CATEGORY_NAME_BY_CODE).map(([code, name]) => [name, code]),
) as Readonly<Record<ProductCategoryGroupTypes, ProductCategoryCodeTypes>>;

export const PRODUCT_CATEGORY_GROUP_BY_SOURCE = {
  김치: '가공식품',
  '김치/반찬': '가공식품',
  수산: '수산물',
  정육: '정육/달걀',
  채소: '채소/과일',
} satisfies Record<string, ProductCategoryGroupTypes>;

export type ProductCategoryFilterOptionTypes = (typeof PRODUCT_CATEGORY_FILTER_OPTIONS)[number];
