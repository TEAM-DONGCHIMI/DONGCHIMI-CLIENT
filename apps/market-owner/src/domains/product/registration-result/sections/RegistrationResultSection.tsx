import { useMemo, useState } from 'react';
import { useToast } from '@dongchimi/shared/toast';

import {
  DesktopUploadHeader,
  PaginationFooter,
  type UploadSegmentTypes,
} from '@/shared/components';
import type { ProductCategoryGroupTypes } from '@/shared/constants/product-categories';

import type { RegistrationResultProduct } from '../fixtures';
import { CATEGORY_FILTER_DROPDOWN_ID } from '../components/RegistrationResultDropdown';
import { RegistrationResultSectionLayout } from '../components/RegistrationResultSectionLayout';
import { RegistrationResultTable } from '../components/RegistrationResultTable';
import { useRegistrationResultCategoryDropdowns } from '../hooks/useRegistrationResultCategoryDropdowns';
import { useRegistrationResultImagePreviews } from '../hooks/useRegistrationResultImagePreviews';
import { useRegistrationResultPagination } from '../hooks/useRegistrationResultPagination';
import { useRegistrationResultProductSearch } from '../hooks/useRegistrationResultProductSearch';
import { useRegistrationResultSelection } from '../hooks/useRegistrationResultSelection';

interface RegistrationResultSummary {
  completedCount: number;
  needsEditCount: number;
  totalCount: number;
}

export interface RegistrationResultSectionProps {
  pageSize: number;
  products: readonly RegistrationResultProduct[];
  summary: RegistrationResultSummary;
  onPrevious: () => void;
  onRegister: () => void;
}

const SEGMENT_LABELS: Record<UploadSegmentTypes, string> = {
  completed: '등록 완료',
  needsEdit: '수정 필요',
  total: '총 상품',
};

const getVisibleTotalCount = ({
  completedCount,
  needsEditCount,
  selectedSegment,
  totalCount,
}: RegistrationResultSummary & { selectedSegment: UploadSegmentTypes }) => {
  if (selectedSegment === 'completed') {
    return completedCount;
  }

  if (selectedSegment === 'needsEdit') {
    return needsEditCount;
  }

  return totalCount;
};

export const RegistrationResultSection = ({
  pageSize,
  products,
  summary,
  onPrevious,
  onRegister,
}: RegistrationResultSectionProps) => {
  const toast = useToast();
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const [productCategories, setProductCategories] = useState<ReadonlyMap<string, string>>(
    new Map(),
  );
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const { deleteImagePreviews, imagePreviews, setImagePreview } =
    useRegistrationResultImagePreviews({
      onPreviewCreateError: () => {
        toast.error('이미지 미리보기를 생성하지 못했습니다. 다시 시도해주세요.');
      },
    });
  const currentProducts = useMemo(() => {
    return products.filter((product) => !removedIds.has(product.id));
  }, [products, removedIds]);
  const completedSampleCount = products.filter((product) => product.status === 'completed').length;
  const currentCompletedSampleCount = currentProducts.filter(
    (product) => product.status === 'completed',
  ).length;
  const removedCompletedCount = completedSampleCount - currentCompletedSampleCount;
  const needsEditCount = currentProducts.filter((product) => product.status === 'needsEdit').length;
  const completedCount = Math.max(0, summary.completedCount - removedCompletedCount);
  const removedCount = products.length - currentProducts.length;
  const totalCount = Math.max(0, summary.totalCount - removedCount);
  const currentSummary = { completedCount, needsEditCount, totalCount };
  const visibleTotalCount = getVisibleTotalCount({ ...currentSummary, selectedSegment });
  const registerDisabled = needsEditCount > 0;
  const {
    action: { changeSearchValue, changeSelectedCategories },
    state: { filteredProducts, hasActiveFilter, searchValue, selectedCategories },
  } = useRegistrationResultProductSearch({
    productCategories,
    products: currentProducts,
    selectedSegment,
  });
  const footerTotalCount = hasActiveFilter ? filteredProducts.length : visibleTotalCount;
  const {
    currentPage: visiblePage,
    goToPage,
    lastPage,
    pageItems: pageProducts,
    pages,
    rangeEnd,
    rangeStart,
    resetPage,
  } = useRegistrationResultPagination({
    items: filteredProducts,
    pageSize,
    rangeTotalCount: footerTotalCount,
  });
  const {
    action: { changeRowChecked, clearSelection, toggleVisibleSelection },
    state: { allVisibleSelected, hasVisibleSelection, selectedCount, selectedIds },
  } = useRegistrationResultSelection({
    visibleProducts: pageProducts,
  });

  const resetTableInteraction = () => {
    resetPage();
    clearSelection();
  };

  const handleSegmentChange = (nextSegment: UploadSegmentTypes) => {
    setSelectedSegment(nextSegment);
    resetTableInteraction();
  };

  const handleSearchValueChange = (nextSearchValue: string) => {
    changeSearchValue(nextSearchValue);
    resetTableInteraction();
  };

  const handlePageChange = (nextPage: number) => {
    if (!goToPage(nextPage)) {
      return;
    }

    clearSelection();
  };

  const handleCategoryFilterChange = (
    nextSelectedCategories: ReadonlySet<ProductCategoryGroupTypes>,
  ) => {
    changeSelectedCategories(nextSelectedCategories);
    resetTableInteraction();
  };

  const handleProductCategoryChange = (productId: string, category: ProductCategoryGroupTypes) => {
    setProductCategories((previousProductCategories) => {
      const nextProductCategories = new Map(previousProductCategories);

      nextProductCategories.set(productId, category);

      return nextProductCategories;
    });
  };

  const {
    action: { openProductCategoryDropdown, toggleCategoryFilterDropdown },
    state: { isCategoryFilterDropdownOpen },
  } = useRegistrationResultCategoryDropdowns({
    onCategoryFilterChange: handleCategoryFilterChange,
    onProductCategoryChange: handleProductCategoryChange,
    productCategories,
    selectedCategoryFilters: selectedCategories,
  });

  const handleImageFileChange = (productId: string) => {
    return (file: File) => {
      setImagePreview(productId, file);
    };
  };

  const handleDeleteSelected = () => {
    setRemovedIds((previousRemovedIds) => {
      const nextRemovedIds = new Set(previousRemovedIds);

      selectedIds.forEach((productId) => nextRemovedIds.add(productId));

      return nextRemovedIds;
    });
    deleteImagePreviews(selectedIds);
    clearSelection();
    resetPage();
  };

  return (
    <RegistrationResultSectionLayout
      needsEditCount={needsEditCount}
      registerDisabled={registerDisabled}
      onPrevious={onPrevious}
      onRegister={onRegister}
    >
      <DesktopUploadHeader
        completedCount={completedCount}
        needsEditCount={needsEditCount}
        onDeleteSelected={handleDeleteSelected}
        onSearch={handleSearchValueChange}
        onSearchValueChange={handleSearchValueChange}
        onSegmentChange={handleSegmentChange}
        onSortClick={toggleCategoryFilterDropdown}
        searchValue={searchValue}
        selectedCount={selectedCount}
        selectedSegment={selectedSegment}
        sortDropdownId={CATEGORY_FILTER_DROPDOWN_ID}
        sortOpen={isCategoryFilterDropdownOpen}
        totalCount={totalCount}
      />

      <RegistrationResultTable
        allVisibleSelected={allVisibleSelected}
        hasVisibleSelection={hasVisibleSelection}
        imagePreviews={imagePreviews}
        productCategories={productCategories}
        products={pageProducts}
        selectedIds={selectedIds}
        segmentLabel={SEGMENT_LABELS[selectedSegment]}
        onImageFileChange={handleImageFileChange}
        onProductCategoryClick={openProductCategoryDropdown}
        onRowCheckedChange={changeRowChecked}
        onSelectAll={toggleVisibleSelection}
      >
        <PaginationFooter
          currentPage={visiblePage}
          nextDisabled={visiblePage >= lastPage}
          onPageChange={handlePageChange}
          pages={pages}
          previousDisabled={visiblePage <= 1}
          rangeEnd={rangeEnd}
          rangeStart={rangeStart}
          totalCount={footerTotalCount}
        />
      </RegistrationResultTable>
    </RegistrationResultSectionLayout>
  );
};
