import { useMemo, useState } from 'react';

import type { UploadSegmentTypes } from '@/shared/components';
import type { ProductCategoryGroupTypes } from '@/shared/constants/product-categories';
import { getProductMatchesCategoryFilter } from '@/shared/utils/product-category.utils';

import type { RegistrationResultProduct } from '../fixtures';

interface UseRegistrationResultProductSearchParams {
  productCategories: ReadonlyMap<string, string>;
  products: readonly RegistrationResultProduct[];
  selectedSegment: UploadSegmentTypes;
}

const getProductMatchesSearch = (
  product: RegistrationResultProduct,
  searchValue: string,
  category = product.category,
) => {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (normalizedSearchValue.length === 0) {
    return true;
  }

  return [product.productName, category, product.promotionText].some((value) =>
    value.toLowerCase().includes(normalizedSearchValue),
  );
};

const getProductMatchesSegment = (
  product: RegistrationResultProduct,
  selectedSegment: UploadSegmentTypes,
) => {
  if (selectedSegment === 'total') {
    return true;
  }

  if (selectedSegment === 'completed') {
    return product.status === 'completed';
  }

  return product.status === 'needsEdit';
};

export const useRegistrationResultProductSearch = ({
  productCategories,
  products,
  selectedSegment,
}: UseRegistrationResultProductSearchParams) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<
    ReadonlySet<ProductCategoryGroupTypes>
  >(new Set());

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = productCategories.get(product.id) ?? product.category;

      return (
        getProductMatchesSegment(product, selectedSegment) &&
        getProductMatchesSearch(product, searchValue, category) &&
        getProductMatchesCategoryFilter(category, selectedCategories)
      );
    });
  }, [productCategories, products, searchValue, selectedCategories, selectedSegment]);

  const changeSearchValue = (nextSearchValue: string) => {
    setSearchValue(nextSearchValue);
  };

  const changeSelectedCategories = (
    nextSelectedCategories: ReadonlySet<ProductCategoryGroupTypes>,
  ) => {
    setSelectedCategories(nextSelectedCategories);
  };

  return {
    action: {
      changeSearchValue,
      changeSelectedCategories,
    },
    state: {
      filteredProducts,
      hasActiveFilter: searchValue.trim().length > 0 || selectedCategories.size > 0,
      searchValue,
      selectedCategories,
    },
  };
};
