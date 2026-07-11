export const productEditSortOptions = [
  {
    label: '상품 등록 순',
    value: 'registered',
  },
  {
    label: '조회수 순',
    value: 'views',
  },
] as const;

export type ProductEditSortTypes = (typeof productEditSortOptions)[number]['value'];
export type ProductEditFilterTypes = 'category' | ProductEditSortTypes;

export type ProductEditTypeTypes = 'eventDiscount' | 'todaySpecial';

export const editPageCopyByType = {
  eventDiscount: {
    currentLabel: '행사 할인 상품 수정',
    heading: '행사 할인 상품을 수정하세요',
  },
  todaySpecial: {
    currentLabel: '오늘의 특가 상품 수정',
    heading: '오늘의 특가 상품을 수정하세요',
  },
} satisfies Record<
  ProductEditTypeTypes,
  {
    currentLabel: string;
    heading: string;
  }
>;
