import { useMemo, useState, type MouseEvent } from 'react';
import { overlay } from 'overlay-kit';

import {
  DesktopUploadHeader,
  PaginationFooter,
  type UploadSegmentTypes,
} from '@/shared/components';

import type { RegistrationResultProduct } from '../fixtures';
import {
  CategoryFilterDropdown,
  ProductCategoryDropdown,
  SORT_DROPDOWN_ID,
  SORT_DROPDOWN_OVERLAY_ID,
  getAnchorRect,
  getProductMatchesCategoryFilter,
  type CategoryOptionTypes,
} from '../components/RegistrationResultDropdown';
import { RegistrationResultSectionLayout } from '../components/RegistrationResultSectionLayout';
import { RegistrationResultTable, type ImagePreview } from '../components/RegistrationResultTable';

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

const readFileAsDataUrl = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);

        return;
      }

      reject(new Error('이미지 파일을 읽지 못했습니다.'));
    });
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(file);
  });
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

const getPaginationPages = (totalCount: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  return Array.from({ length: Math.min(pageCount, 2) }, (_, index) => index + 1);
};

export const RegistrationResultSection = ({
  pageSize,
  products,
  summary,
  onPrevious,
  onRegister,
}: RegistrationResultSectionProps) => {
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const [imagePreviews, setImagePreviews] = useState<ReadonlyMap<string, ImagePreview>>(new Map());
  const [productCategories, setProductCategories] = useState<ReadonlyMap<string, string>>(
    new Map(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ReadonlySet<CategoryOptionTypes>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
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

  const pages = getPaginationPages(filteredProducts.length, pageSize);
  const lastPage = pages[pages.length - 1] ?? 1;
  const visiblePage = Math.min(currentPage, lastPage);
  const pageStartIndex = (visiblePage - 1) * pageSize;
  const pageEndIndex = pageStartIndex + pageSize;
  const pageProducts = filteredProducts.slice(pageStartIndex, pageEndIndex);
  const selectedCount = pageProducts.filter((product) => selectedIds.has(product.id)).length;
  const allVisibleSelected = pageProducts.length > 0 && selectedCount === pageProducts.length;
  const hasVisibleSelection = selectedCount > 0;
  let footerTotalCount = visibleTotalCount;
  let rangeStart = 0;
  const hasActiveFilter = searchValue.trim().length > 0 || selectedCategories.size > 0;

  if (hasActiveFilter) {
    footerTotalCount = filteredProducts.length;
  }

  if (footerTotalCount > 0) {
    rangeStart = pageStartIndex + 1;
  }

  const rangeEnd = Math.min(pageEndIndex, footerTotalCount);

  const handleSegmentChange = (nextSegment: UploadSegmentTypes) => {
    setSelectedSegment(nextSegment);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleSearchValueChange = (nextSearchValue: string) => {
    setSearchValue(nextSearchValue);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > lastPage) {
      return;
    }

    setCurrentPage(nextPage);
    setSelectedIds(new Set());
  };

  const handleSortClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (sortDropdownOpen) {
      overlay.close(SORT_DROPDOWN_OVERLAY_ID);
      overlay.unmount(SORT_DROPDOWN_OVERLAY_ID);
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
            setCurrentPage(1);
            setSelectedIds(new Set());
          }}
        />
      ),
      { overlayId: SORT_DROPDOWN_OVERLAY_ID },
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
      void readFileAsDataUrl(file).then((src) => {
        setImagePreviews((previousImagePreviews) => {
          const nextImagePreviews = new Map(previousImagePreviews);

          nextImagePreviews.set(productId, { alt: file.name, src });

          return nextImagePreviews;
        });
      });
    };
  };

  const handleDeleteSelected = () => {
    setRemovedIds((previousRemovedIds) => {
      const nextRemovedIds = new Set(previousRemovedIds);

      selectedIds.forEach((productId) => nextRemovedIds.add(productId));

      return nextRemovedIds;
    });
    setSelectedIds(new Set());
    setCurrentPage(1);
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
        sortDropdownId={SORT_DROPDOWN_ID}
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
