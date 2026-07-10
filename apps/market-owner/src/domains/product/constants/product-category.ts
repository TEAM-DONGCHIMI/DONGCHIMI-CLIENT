export const productCategoryOptions = [
  '전체',
  '채소·과일',
  '정육·달걀',
  '수산',
  '유제품',
  '간편식',
  '가공식품',
  '음료·주류',
  '생활용품',
  '기타',
] as const;

export type ProductCategoryTypes = (typeof productCategoryOptions)[number];
export type ProductSelectableCategoryTypes = Exclude<ProductCategoryTypes, '전체'>;

export const productSelectableCategoryOptions = productCategoryOptions.filter(
  (category): category is ProductSelectableCategoryTypes => category !== '전체',
);

export const isProductSelectableCategory = (
  categoryName: string,
): categoryName is ProductSelectableCategoryTypes => {
  return productSelectableCategoryOptions.includes(categoryName as ProductSelectableCategoryTypes);
};
