export const PRODUCT_CATEGORY_ALL_OPTION = '전체';

export const PRODUCT_CATEGORY_GROUP_OPTIONS = [
  '채소･과일',
  '정육･달걀',
  '수산',
  '유제품',
  '간편식',
  '가공식품',
  '음료･주류',
  '생활용품',
  '기타',
] as const;

export type ProductCategoryGroupTypes = (typeof PRODUCT_CATEGORY_GROUP_OPTIONS)[number];

export const PRODUCT_CATEGORY_FILTER_OPTIONS = [
  PRODUCT_CATEGORY_ALL_OPTION,
  ...PRODUCT_CATEGORY_GROUP_OPTIONS,
] as const;

export const PRODUCT_CATEGORY_GROUP_BY_SOURCE = {
  김치: '가공식품',
  '김치/반찬': '가공식품',
  수산: '수산',
  정육: '정육･달걀',
  채소: '채소･과일',
} satisfies Record<string, ProductCategoryGroupTypes>;

export type ProductCategoryFilterOptionTypes = (typeof PRODUCT_CATEGORY_FILTER_OPTIONS)[number];
