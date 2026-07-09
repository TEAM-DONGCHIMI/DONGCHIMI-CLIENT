import { useRef, useState } from 'react';

import { type ProductCategoryTypes } from '../../../constants';
import {
  type ProductEditFilterTypes,
  type ProductEditTypeTypes,
} from '../ProductEditPageShell.constants';
import { useProductEditCategoryDropdown } from './use-product-edit-category-dropdown';

interface UseProductEditFilterParams {
  activeType: ProductEditTypeTypes;
}

export const useProductEditFilter = ({ activeType }: UseProductEditFilterParams) => {
  const [selectedFilter, setSelectedFilter] = useState<ProductEditFilterTypes>('registered');
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const showCategoryFilter = activeType === 'eventDiscount';
  const {
    closeCategoryDropdown,
    isCategoryDropdownOpen,
    selectCategory,
    selectedCategory,
    toggleCategoryDropdown,
  } = useProductEditCategoryDropdown(categoryFilterRef);
  const visibleSelectedFilter =
    !showCategoryFilter && selectedFilter === 'category' ? 'registered' : selectedFilter;
  const isCategorySelected = visibleSelectedFilter === 'category';

  const openCategoryDropdown = () => {
    toggleCategoryDropdown();
  };

  const selectCategoryFilter = (category: ProductCategoryTypes) => {
    selectCategory(category);
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
