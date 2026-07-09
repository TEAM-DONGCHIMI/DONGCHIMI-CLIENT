import { describe, expect, it } from 'vitest';

import { createProductEditDisplayGroups } from './create-product-edit-display-groups';
import { type ProductEditGroupableProduct } from './display-group.types';

const products = [
  {
    categoryName: '채소·과일',
    productName: '사과 4입',
    registeredDateLabel: '2026년 8월 14일',
    salePrice: '9,900',
    viewCount: 97,
  },
  {
    categoryName: '정육·달걀',
    productName: '삼겹살 500g',
    registeredDateLabel: '2026년 8월 15일',
    salePrice: '4,500',
    viewCount: 162,
  },
  {
    categoryName: '정육·달걀',
    productName: '대란 30구',
    registeredDateLabel: '2026년 8월 14일',
    salePrice: '6,500',
    viewCount: 121,
  },
] satisfies ProductEditGroupableProduct[];

const createCardProps = (product: ProductEditGroupableProduct) => product;

describe('createProductEditDisplayGroups', () => {
  it('groups products by category option order when category filter is supported', () => {
    const groups = createProductEditDisplayGroups({
      createCardProps,
      products,
      selectedCategory: null,
      selectedFilter: 'category',
      supportsCategoryFilter: true,
    });

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.title)).toEqual(['채소·과일', '정육·달걀']);
    expect(groups[0]?.products.map((product) => product.productName)).toEqual(['사과 4입']);
    expect(groups[1]?.products.map((product) => product.productName)).toEqual([
      '삼겹살 500g',
      '대란 30구',
    ]);
  });

  it('treats all category selection as the default category group state', () => {
    const groups = createProductEditDisplayGroups({
      createCardProps,
      products,
      selectedCategory: '전체',
      selectedFilter: 'category',
      supportsCategoryFilter: true,
    });

    expect(groups.map((group) => group.title)).toEqual(['채소·과일', '정육·달걀']);
  });

  it('filters products by selected category after a category option is selected', () => {
    const groups = createProductEditDisplayGroups({
      createCardProps,
      products,
      selectedCategory: '정육·달걀',
      selectedFilter: 'category',
      supportsCategoryFilter: true,
    });

    expect(groups).toHaveLength(1);
    expect(groups[0]?.title).toBe('정육·달걀');
    expect(groups[0]?.products.map((product) => product.productName)).toEqual([
      '삼겹살 500g',
      '대란 30구',
    ]);
  });

  it('sorts products by view count in descending order', () => {
    const groups = createProductEditDisplayGroups({
      createCardProps,
      products,
      selectedCategory: null,
      selectedFilter: 'views',
      supportsCategoryFilter: true,
    });

    expect(groups).toHaveLength(1);
    expect(groups[0]?.title).toBe('조회수 높은 순');
    expect(groups[0]?.products.map((product) => product.productName)).toEqual([
      '삼겹살 500g',
      '대란 30구',
      '사과 4입',
    ]);
  });
});
