import { useMemo, useState } from 'react';

import type { UploadSegmentTypes } from '@/shared/components';
import type { ProductCategoryGroupTypes } from '@/shared/constants/product-categories';
import {
  getProductCategoryGroup,
  getProductMatchesCategoryFilter,
} from '@/shared/utils/product-category.utils';

import type { RegistrationResultProduct, RegistrationResultProductDraftMapTypes } from '../model';
import { getRegistrationResultProductFieldValues } from '../model';

interface UseRegistrationResultProductSearchParams {
  productDrafts: RegistrationResultProductDraftMapTypes;
  products: readonly RegistrationResultProduct[];
  selectedSegment: UploadSegmentTypes;
}

const getProductMatchesSearch = (productName: string, searchValue: string) => {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (normalizedSearchValue.length === 0) {
    return true;
  }

  return productName.toLowerCase().includes(normalizedSearchValue);
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
  productDrafts,
  products,
  selectedSegment,
}: UseRegistrationResultProductSearchParams) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<
    ReadonlySet<ProductCategoryGroupTypes>
  >(new Set());

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const fieldValues = getRegistrationResultProductFieldValues(product, productDrafts);
      const category =
        fieldValues.category.trim().length > 0 ? getProductCategoryGroup(fieldValues.category) : '';
      const matchesCategoryFilter =
        selectedCategories.size === 0 ||
        (category.length > 0 && getProductMatchesCategoryFilter(category, selectedCategories));

      return (
        getProductMatchesSegment(product, selectedSegment) &&
        getProductMatchesSearch(fieldValues.productName, searchValue) &&
        matchesCategoryFilter
      );
    });
  }, [productDrafts, products, searchValue, selectedCategories, selectedSegment]);

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
