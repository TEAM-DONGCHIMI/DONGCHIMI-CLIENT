import { useCallback, useMemo, useRef, useState } from 'react';
import { useToast } from '@dongchimi/shared/toast';

import {
  DesktopUploadHeader,
  PaginationFooter,
  type UploadSegmentTypes,
} from '@/shared/components';
import type { ProductCategoryGroupTypes } from '@/shared/constants/product-categories';

import type { SavePreparedProductDraftsRequestTypes } from '../../api/save-prepared-product-drafts';
import { CATEGORY_FILTER_DROPDOWN_ID } from '../components/RegistrationResultDropdown';
import { RegistrationResultSectionLayout } from '../components/RegistrationResultSectionLayout';
import { RegistrationResultTable } from '../components/RegistrationResultTable';
import { useRegistrationResultCategoryDropdowns } from '../hooks/useRegistrationResultCategoryDropdowns';
import { useRegistrationResultDraftAutosave } from '../hooks/useRegistrationResultDraftAutosave';
import { useRegistrationResultDraftRevisions } from '../hooks/useRegistrationResultDraftRevisions';
import { useRegistrationResultImagePreviews } from '../hooks/useRegistrationResultImagePreviews';
import { useRegistrationResultImageUploads } from '../hooks/useRegistrationResultImageUploads';
import { useRegistrationResultPagination } from '../hooks/useRegistrationResultPagination';
import { useRegistrationResultProductDrafts } from '../hooks/useRegistrationResultProductDrafts';
import { useRegistrationResultProductSearch } from '../hooks/useRegistrationResultProductSearch';
import { useRegistrationResultSelection } from '../hooks/useRegistrationResultSelection';
import {
  createPreparedProductDraftSaveRequest,
  getRegistrationResultProductFieldValues,
  type RegistrationResultEditableProductFieldTypes,
  type RegistrationResultProduct,
} from '../model';
import type { ResolveProductImageFileObjectKeyTypes } from '../utils/resolve-product-image-file-url';
import { validateRegistrationResultProductFields } from '../utils/registration-result-product-validation';

interface RegistrationResultSummary {
  completedCount: number;
  needsEditCount: number;
  totalCount: number;
}

interface SaveCurrentDraftsOptions {
  force?: boolean;
}

export interface RegistrationResultSectionProps {
  emptyMessage?: string;
  isSavingDrafts?: boolean;
  pageSize: number;
  products: readonly RegistrationResultProduct[];
  saveDebounceMs?: number;
  summary: RegistrationResultSummary;
  onPrevious: () => void;
  onRegister: () => void;
  resolveProductImageFileObjectKey?: ResolveProductImageFileObjectKeyTypes;
  onSaveDrafts?: (
    request: SavePreparedProductDraftsRequestTypes,
  ) => Promise<RegistrationResultDraftSyncResult>;
}

export interface RegistrationResultDraftSyncResult {
  failCount: number;
}

const SEGMENT_LABELS: Record<UploadSegmentTypes, string> = {
  completed: '등록 완료',
  needsEdit: '수정 필요',
  total: '총 상품',
};
const AUTO_SAVE_DEBOUNCE_MS = 1_000;
const IMAGE_UPLOAD_ERROR_TOAST_ID = 'registration-result-image-upload-error';
const SAVE_DRAFT_ERROR_TOAST_ID = 'registration-result-save-draft-error';
const UNSUPPORTED_IMAGE_FILE_ERROR_TOAST_ID = 'registration-result-unsupported-image-file-error';
const SUPPORTED_PRODUCT_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const SUPPORTED_PRODUCT_IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png)$/i;

const isSupportedProductImageFile = (file: File) => {
  if (SUPPORTED_PRODUCT_IMAGE_MIME_TYPES.has(file.type)) {
    return true;
  }

  return file.type.length === 0 && SUPPORTED_PRODUCT_IMAGE_EXTENSION_PATTERN.test(file.name);
};

const createProductWithCurrentStatus = ({
  hasProductImage,
  hasLocalChanges,
  product,
}: {
  hasProductImage: boolean;
  hasLocalChanges: boolean;
  product: RegistrationResultProduct;
}): RegistrationResultProduct => {
  if (!hasLocalChanges) {
    return product;
  }

  const fieldErrors = validateRegistrationResultProductFields(product);
  const hasError = Object.keys(fieldErrors).length > 0;

  return !hasProductImage || hasError ? { ...product, status: 'needsEdit' } : product;
};

export const RegistrationResultSection = ({
  emptyMessage,
  isSavingDrafts = false,
  pageSize,
  products,
  saveDebounceMs = AUTO_SAVE_DEBOUNCE_MS,
  summary,
  onPrevious,
  onRegister,
  resolveProductImageFileObjectKey,
  onSaveDrafts,
}: RegistrationResultSectionProps) => {
  const toast = useToast();
  const lastSavedDraftKeyRef = useRef<string | null>(null);
  const lastDraftSyncResultRef = useRef<RegistrationResultDraftSyncResult>({
    failCount: summary.needsEditCount,
  });
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const [touchedProductIds, setTouchedProductIds] = useState<ReadonlySet<string>>(new Set());
  const markProductsTouched = useCallback((productIds: Iterable<string>) => {
    const nextTouchedProductIds = Array.from(productIds);

    setTouchedProductIds((previousTouchedProductIds) => {
      const nextIds = new Set(previousTouchedProductIds);

      nextTouchedProductIds.forEach((productId) => nextIds.add(productId));

      return nextIds;
    });
  }, []);
  const { deleteImagePreviews, imagePreviews, setImagePreview } =
    useRegistrationResultImagePreviews({
      onPreviewCreateError: () => {
        toast.error('이미지 미리보기를 생성하지 못했습니다. 다시 시도해주세요.');
      },
    });
  const {
    action: { acknowledgeSavedUploads, getUploadedObjectKeys, removeUploads, uploadImage },
    state: { hasUploadErrors, isUploading: isUploadingImages },
  } = useRegistrationResultImageUploads({
    onUploadError: () => {
      toast.error('이미지 업로드에 실패했습니다. 이미지를 다시 선택해주세요.', {
        id: IMAGE_UPLOAD_ERROR_TOAST_ID,
      });
    },
    resolveProductImageFileObjectKey,
  });
  const {
    action: { changeProductField, deleteProductDrafts },
    state: { productDrafts },
  } = useRegistrationResultProductDrafts();
  const {
    action: {
      acknowledge: acknowledgeRevisions,
      getSnapshot: getRevisionSnapshot,
      hasPendingChangesNow,
      markChanged: markProductsChanged,
    },
    state: { hasPendingChanges, revision },
  } = useRegistrationResultDraftRevisions();
  const handleProductFieldChange = (
    productId: string,
    field: RegistrationResultEditableProductFieldTypes,
    value: string,
  ) => {
    markProductsTouched([productId]);
    markProductsChanged([productId]);
    changeProductField(productId, field, value);
  };
  const currentProducts = useMemo(() => {
    return products
      .filter((product) => !removedIds.has(product.id))
      .map((product) => {
        const fieldValues = getRegistrationResultProductFieldValues(product, productDrafts);
        const productWithDrafts = { ...product, ...fieldValues };
        const hasImagePreview = imagePreviews.has(product.id);
        const hasProductImage = hasImagePreview || product.imageUrl != null;

        return createProductWithCurrentStatus({
          hasProductImage,
          hasLocalChanges: touchedProductIds.has(product.id),
          product: productWithDrafts,
        });
      });
  }, [imagePreviews, productDrafts, products, removedIds, touchedProductIds]);
  const { completedCount, needsEditCount, totalCount } = summary;
  const {
    action: { changeSearchValue, changeSelectedCategories },
    state: { filteredProducts, searchValue, selectedCategories },
  } = useRegistrationResultProductSearch({
    productDrafts,
    products: currentProducts,
    selectedSegment,
  });
  const footerTotalCount = filteredProducts.length;
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
    handleProductFieldChange(productId, 'category', category);
  };

  const {
    action: { openProductCategoryDropdown, toggleCategoryFilterDropdown },
    state: { isCategoryFilterDropdownOpen },
  } = useRegistrationResultCategoryDropdowns({
    onCategoryFilterChange: handleCategoryFilterChange,
    onProductCategoryChange: handleProductCategoryChange,
    productDrafts,
    selectedCategoryFilters: selectedCategories,
  });

  const handleDeleteSelected = () => {
    markProductsTouched(selectedIds);
    markProductsChanged(selectedIds);
    setRemovedIds((previousRemovedIds) => {
      const nextRemovedIds = new Set(previousRemovedIds);

      selectedIds.forEach((productId) => nextRemovedIds.add(productId));

      return nextRemovedIds;
    });
    removeUploads(selectedIds);
    deleteImagePreviews(selectedIds);
    deleteProductDrafts(selectedIds);
    clearSelection();
    resetPage();
  };

  const hasLocalValidationErrors = useMemo(() => {
    return currentProducts.some((product) => {
      if (!touchedProductIds.has(product.id)) {
        return false;
      }

      const hasProductImage = imagePreviews.has(product.id) || product.imageUrl != null;
      const fieldErrors = validateRegistrationResultProductFields(product);

      return !hasProductImage || Object.keys(fieldErrors).length > 0;
    });
  }, [currentProducts, imagePreviews, touchedProductIds]);

  const acknowledgeSavedRevisions = useCallback(
    (
      savedRevisionSnapshot: ReadonlyMap<string, number>,
      savedImageObjectKeys: ReadonlyMap<string, string>,
    ) => {
      const acknowledgedProductIds = acknowledgeRevisions(savedRevisionSnapshot);

      if (acknowledgedProductIds.size === 0) {
        return;
      }

      deleteProductDrafts(acknowledgedProductIds);
      const acknowledgedImageObjectKeys = new Map(
        Array.from(savedImageObjectKeys).filter(([productId]) =>
          acknowledgedProductIds.has(productId),
        ),
      );
      const acknowledgedImageProductIds = acknowledgeSavedUploads(acknowledgedImageObjectKeys);

      deleteImagePreviews(acknowledgedImageProductIds);
    },
    [acknowledgeRevisions, acknowledgeSavedUploads, deleteImagePreviews, deleteProductDrafts],
  );

  const saveCurrentDrafts = useCallback(
    async ({ force = false }: SaveCurrentDraftsOptions = {}) => {
      const savedRevisionSnapshot = getRevisionSnapshot();

      if (onSaveDrafts == null) {
        return { failCount: summary.needsEditCount };
      }

      try {
        const productImageObjectKeys = getUploadedObjectKeys();
        const request = createPreparedProductDraftSaveRequest({
          productImageObjectKeys,
          productDrafts,
          products: currentProducts,
        });
        const draftKey = JSON.stringify(request);

        if (!force && savedRevisionSnapshot.size === 0) {
          return lastDraftSyncResultRef.current;
        }

        if (!force && draftKey === lastSavedDraftKeyRef.current) {
          acknowledgeSavedRevisions(savedRevisionSnapshot, productImageObjectKeys);

          return lastDraftSyncResultRef.current;
        }

        const draftSyncResult = await onSaveDrafts(request);

        lastSavedDraftKeyRef.current = draftKey;
        lastDraftSyncResultRef.current = draftSyncResult;
        acknowledgeSavedRevisions(savedRevisionSnapshot, productImageObjectKeys);

        return draftSyncResult;
      } catch {
        toast.error('임시 저장에 실패했습니다. 잠시 후 다시 시도해주세요.', {
          id: SAVE_DRAFT_ERROR_TOAST_ID,
        });

        return null;
      }
    },
    [
      acknowledgeSavedRevisions,
      currentProducts,
      getUploadedObjectKeys,
      getRevisionSnapshot,
      onSaveDrafts,
      productDrafts,
      summary.needsEditCount,
      toast,
    ],
  );
  const {
    flush: flushDrafts,
    isSaving: isDraftSyncPending,
    stop: stopDraftAutosave,
  } = useRegistrationResultDraftAutosave({
    debounceMs: saveDebounceMs,
    enabled: onSaveDrafts != null,
    hasPendingChanges,
    onSave: saveCurrentDrafts,
    revision,
  });
  const handleImageFileChange = (productId: string) => {
    return (file: File) => {
      if (!isSupportedProductImageFile(file)) {
        toast.error('지원하지 않는 파일 형식입니다.', {
          id: UNSUPPORTED_IMAGE_FILE_ERROR_TOAST_ID,
        });

        return;
      }

      if (!setImagePreview(productId, file)) {
        return;
      }

      markProductsTouched([productId]);

      void uploadImage(productId, file).then((uploadResult) => {
        const latestUploadedObjectKey = getUploadedObjectKeys().get(productId);

        if (
          uploadResult == null ||
          uploadResult.objectKey !== latestUploadedObjectKey ||
          onSaveDrafts == null
        ) {
          return;
        }

        markProductsChanged([productId]);
        void flushDrafts();
      });
    };
  };
  const registerDisabled =
    needsEditCount > 0 ||
    hasPendingChanges ||
    hasLocalValidationErrors ||
    hasUploadErrors ||
    isUploadingImages ||
    isSavingDrafts ||
    isDraftSyncPending;

  const handleRegister = async () => {
    const draftSyncResult = await flushDrafts();

    if (draftSyncResult?.failCount === 0 && !hasPendingChangesNow()) {
      onRegister();
    }
  };
  const handlePrevious = () => {
    stopDraftAutosave();
    onPrevious();
  };

  return (
    <RegistrationResultSectionLayout
      needsEditCount={needsEditCount}
      registerDisabled={registerDisabled}
      onPrevious={handlePrevious}
      onRegister={handleRegister}
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
        emptyMessage={emptyMessage}
        hasVisibleSelection={hasVisibleSelection}
        imagePreviews={imagePreviews}
        productDrafts={productDrafts}
        products={pageProducts}
        selectedIds={selectedIds}
        segmentLabel={SEGMENT_LABELS[selectedSegment]}
        onImageFileChange={handleImageFileChange}
        onProductFieldChange={handleProductFieldChange}
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
          showNavigation={footerTotalCount > pageSize}
          totalCount={footerTotalCount}
        />
      </RegistrationResultTable>
    </RegistrationResultSectionLayout>
  );
};
