import { useMemo, useState, type MouseEvent } from 'react';
import { useToast } from '@dongchimi/shared/toast';
import { overlay } from 'overlay-kit';

import {
  DesktopUploadHeader,
  PaginationFooter,
  type UploadSegmentTypes,
} from '@/shared/components';

import type { RegistrationResultProduct } from '../fixtures';
import {
  CATEGORY_FILTER_DROPDOWN_ID,
  CATEGORY_FILTER_DROPDOWN_OVERLAY_ID,
  CategoryFilterDropdown,
  ProductCategoryDropdown,
  getAnchorRect,
  getProductMatchesCategoryFilter,
  type CategoryOptionTypes,
} from '../components/RegistrationResultDropdown';
import { RegistrationResultSectionLayout } from '../components/RegistrationResultSectionLayout';
import { RegistrationResultTable } from '../components/RegistrationResultTable';
import { useRegistrationResultImagePreviews } from '../hooks/useRegistrationResultImagePreviews';
import { useRegistrationResultPagination } from '../hooks/useRegistrationResultPagination';

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
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ReadonlySet<CategoryOptionTypes>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
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

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      const category = productCategories.get(product.id) ?? product.category;

      return (
        getProductMatchesSegment(product, selectedSegment) &&
        getProductMatchesSearch(product, searchValue, category) &&
        getProductMatchesCategoryFilter(category, selectedCategories)
      );
    });
  }, [currentProducts, productCategories, searchValue, selectedCategories, selectedSegment]);

  const hasActiveFilter = searchValue.trim().length > 0 || selectedCategories.size > 0;
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
  const selectedCount = pageProducts.filter((product) => selectedIds.has(product.id)).length;
  const allVisibleSelected = pageProducts.length > 0 && selectedCount === pageProducts.length;
  const hasVisibleSelection = selectedCount > 0;

  const handleSegmentChange = (nextSegment: UploadSegmentTypes) => {
    setSelectedSegment(nextSegment);
    resetPage();
    setSelectedIds(new Set());
  };

  const handleSearchValueChange = (nextSearchValue: string) => {
    setSearchValue(nextSearchValue);
    resetPage();
    setSelectedIds(new Set());
  };

  const handlePageChange = (nextPage: number) => {
    if (!goToPage(nextPage)) {
      return;
    }

    setSelectedIds(new Set());
  };

  const handleSortClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (sortDropdownOpen) {
      overlay.close(CATEGORY_FILTER_DROPDOWN_OVERLAY_ID);
      overlay.unmount(CATEGORY_FILTER_DROPDOWN_OVERLAY_ID);
      setSortDropdownOpen(false);

      return;
    }

    const anchorRect = getAnchorRect(event.currentTarget);

    setSortDropdownOpen(true);
    overlay.open(
      ({ isOpen, close, unmount }) => (
        <CategoryFilterDropdown
          anchorRect={anchorRect}
          close={close}
          isOpen={isOpen}
          selectedCategories={selectedCategories}
          unmount={unmount}
          onDismiss={() => setSortDropdownOpen(false)}
          onSelectionChange={(nextSelectedCategories) => {
            setSelectedCategories(nextSelectedCategories);
            resetPage();
            setSelectedIds(new Set());
          }}
        />
      ),
      { overlayId: CATEGORY_FILTER_DROPDOWN_OVERLAY_ID },
    );
  };

  const handleProductCategoryClick =
    (product: RegistrationResultProduct) => (event: MouseEvent<HTMLButtonElement>) => {
      const anchorRect = getAnchorRect(event.currentTarget);
      const selectedCategory = productCategories.get(product.id) ?? product.category;

      overlay.open(
        ({ isOpen, close, unmount }) => (
          <ProductCategoryDropdown
            anchorRect={anchorRect}
            close={close}
            isOpen={isOpen}
            selectedCategory={selectedCategory}
            unmount={unmount}
            onSelect={(category) =>
              setProductCategories((previousProductCategories) => {
                const nextProductCategories = new Map(previousProductCategories);

                nextProductCategories.set(product.id, category);

                return nextProductCategories;
              })
            }
          />
        ),
        { overlayId: `registration-result-category-dropdown-${product.id}` },
      );
    };

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
    setSelectedIds(new Set());
    resetPage();
  };

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((previousSelectedIds) => {
        const nextSelectedIds = new Set(previousSelectedIds);

        pageProducts.forEach((product) => nextSelectedIds.delete(product.id));

        return nextSelectedIds;
      });

      return;
    }

    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      pageProducts.forEach((product) => nextSelectedIds.add(product.id));

      return nextSelectedIds;
    });
  };

  const handleRowCheckedChange = (productId: string, checked: boolean) => {
    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      if (checked) {
        nextSelectedIds.add(productId);
      } else {
        nextSelectedIds.delete(productId);
      }

      return nextSelectedIds;
    });
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
        onSortClick={handleSortClick}
        searchValue={searchValue}
        selectedCount={selectedCount}
        selectedSegment={selectedSegment}
        sortDropdownId={CATEGORY_FILTER_DROPDOWN_ID}
        sortOpen={sortDropdownOpen}
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
        onProductCategoryClick={handleProductCategoryClick}
        onRowCheckedChange={handleRowCheckedChange}
        onSelectAll={handleSelectAll}
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
