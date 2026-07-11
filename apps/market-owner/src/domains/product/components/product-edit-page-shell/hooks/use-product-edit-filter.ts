import { useRef, useState } from 'react';

import { type ProductCategoryTypes } from '../../../constants';
import {
  type ProductEditFilterTypes,
  type ProductEditTypeTypes,
} from '../ProductEditPageShell.constants';
import { useProductCategoryDropdown } from '../../../hooks';

interface UseProductEditFilterParams {
  activeType: ProductEditTypeTypes;
}

const getDefaultSelectedFilter = (activeType: ProductEditTypeTypes): ProductEditFilterTypes => {
  return activeType === 'eventDiscount' ? 'category' : 'registered';
};

export const useProductEditFilter = ({ activeType }: UseProductEditFilterParams) => {
  const [selectedFilter, setSelectedFilter] = useState<ProductEditFilterTypes>(() =>
    getDefaultSelectedFilter(activeType),
  );
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const showCategoryFilter = activeType === 'eventDiscount';
  const {
    closeCategoryDropdown,
    isCategoryDropdownOpen,
    selectCategory,
    selectedCategory,
    toggleCategoryDropdown,
  } = useProductCategoryDropdown(categoryFilterRef);
  const visibleSelectedFilter =
    !showCategoryFilter && selectedFilter === 'category' ? 'registered' : selectedFilter;
  const isCategorySelected = visibleSelectedFilter === 'category';

  const openCategoryDropdown = () => {
    toggleCategoryDropdown();
  };

  const selectCategoryFilter = (category: ProductCategoryTypes) => {
    selectCategory(category === '전체' ? null : category);
    setSelectedFilter('category');
  };

  const selectSortFilter = (value: ProductEditFilterTypes) => {
    setSelectedFilter(value);
    closeCategoryDropdown();
  };

  return {
    categoryFilterRef,
    isCategoryDropdownOpen,
    isCategorySelected,
    selectedCategory,
    selectedFilter: visibleSelectedFilter,
    showCategoryFilter,
    openCategoryDropdown,
    selectCategoryFilter,
    selectSortFilter,
  };
};
