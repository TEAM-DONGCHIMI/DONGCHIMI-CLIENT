import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useRegistrationResultImagePreviews } from '../hooks/useRegistrationResultImagePreviews';
import { useRegistrationResultPagination } from '../hooks/useRegistrationResultPagination';
import { useRegistrationResultProductDrafts } from '../hooks/useRegistrationResultProductDrafts';
import { useRegistrationResultProductSearch } from '../hooks/useRegistrationResultProductSearch';
import { useRegistrationResultSelection } from '../hooks/useRegistrationResultSelection';
import {
  createPreparedProductDraftSaveRequest,
  getRegistrationResultProductFieldValues,
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
  saveIntervalMs?: number;
  summary: RegistrationResultSummary;
  onDraftQueryChange?: (params: RegistrationResultDraftQueryParams) => void;
  onPrevious: () => void;
  onRegister: () => void;
  resolveProductImageFileObjectKey?: ResolveProductImageFileObjectKeyTypes;
  onSaveDrafts?: (request: SavePreparedProductDraftsRequestTypes) => Promise<unknown>;
}

export interface RegistrationResultDraftQueryParams {
  categories: readonly ProductCategoryGroupTypes[];
  search: string;
}

const SEGMENT_LABELS: Record<UploadSegmentTypes, string> = {
  completed: '등록 완료',
  needsEdit: '수정 필요',
  total: '총 상품',
};
const AUTO_SAVE_INTERVAL_MS = 5_000;
const SAVE_DRAFT_ERROR_TOAST_ID = 'registration-result-save-draft-error';
const UNSUPPORTED_IMAGE_FILE_ERROR_TOAST_ID = 'registration-result-unsupported-image-file-error';
const SUPPORTED_PRODUCT_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const SUPPORTED_PRODUCT_IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png)$/i;

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

  if (hasProductImage && !hasError) {
    return {
      ...product,
      status: 'completed',
      statusReason: undefined,
    };
  }

  return {
    ...product,
    status: 'needsEdit',
  };
};

export const RegistrationResultSection = ({
  emptyMessage,
  isSavingDrafts = false,
  pageSize,
  products,
  saveIntervalMs = AUTO_SAVE_INTERVAL_MS,
  summary,
  onDraftQueryChange,
  onPrevious,
  onRegister,
  resolveProductImageFileObjectKey,
  onSaveDrafts,
}: RegistrationResultSectionProps) => {
  const toast = useToast();
  const uploadedImageObjectKeyRef = useRef<ReadonlyMap<string, { file: File; objectKey: string }>>(
    new Map(),
  );
  const isLeavingRef = useRef(false);
  const lastSavedDraftKeyRef = useRef<string | null>(null);
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const { deleteImagePreviews, imagePreviews, setImagePreview } =
    useRegistrationResultImagePreviews({
      onPreviewCreateError: () => {
        toast.error('이미지 미리보기를 생성하지 못했습니다. 다시 시도해주세요.');
      },
    });
  const {
    action: { changeProductField, deleteProductDrafts },
    state: { productDrafts },
  } = useRegistrationResultProductDrafts();
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
          hasLocalChanges: hasImagePreview || productDrafts.has(product.id),
          product: productWithDrafts,
        });
      });
  }, [imagePreviews, productDrafts, products, removedIds]);
  const hasLoadedProducts = products.length > 0;
  const needsEditCount = hasLoadedProducts
    ? currentProducts.filter((product) => product.status === 'needsEdit').length
    : summary.needsEditCount;
  const completedCount = hasLoadedProducts
    ? currentProducts.filter((product) => product.status === 'completed').length
    : summary.completedCount;
  const totalCount = hasLoadedProducts ? currentProducts.length : summary.totalCount;
  const currentSummary = { completedCount, needsEditCount, totalCount };
  const visibleTotalCount = getVisibleTotalCount({ ...currentSummary, selectedSegment });
  const registerDisabled = needsEditCount > 0;
  const {
    action: { changeSearchValue, changeSelectedCategories },
    state: { filteredProducts, hasActiveFilter, searchValue, selectedCategories },
  } = useRegistrationResultProductSearch({
    productDrafts,
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

  const notifyDraftQueryChange = useCallback(
    (params: RegistrationResultDraftQueryParams) => {
      onDraftQueryChange?.(params);
    },
    [onDraftQueryChange],
  );

  const handleSegmentChange = (nextSegment: UploadSegmentTypes) => {
    setSelectedSegment(nextSegment);
    resetTableInteraction();
  };

  const handleSearchValueChange = (nextSearchValue: string) => {
    changeSearchValue(nextSearchValue);
    notifyDraftQueryChange({
      categories: Array.from(selectedCategories),
      search: nextSearchValue,
    });
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
    notifyDraftQueryChange({
      categories: Array.from(nextSelectedCategories),
      search: searchValue,
    });
    resetTableInteraction();
  };

  const handleProductCategoryChange = (productId: string, category: ProductCategoryGroupTypes) => {
    changeProductField(productId, 'category', category);
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

  const handleImageFileChange = (productId: string) => {
    return (file: File) => {
      if (!isSupportedProductImageFile(file)) {
        toast.error('지원하지 않는 파일 형식입니다.', {
          id: UNSUPPORTED_IMAGE_FILE_ERROR_TOAST_ID,
        });

        return;
      }

      setImagePreview(productId, file);
    };
  };

  const handleDeleteSelected = () => {
    setRemovedIds((previousRemovedIds) => {
      const nextRemovedIds = new Set(previousRemovedIds);

      selectedIds.forEach((productId) => nextRemovedIds.add(productId));

      return nextRemovedIds;
    });
    uploadedImageObjectKeyRef.current = new Map(
      Array.from(uploadedImageObjectKeyRef.current).filter(
        ([productId]) => !selectedIds.has(productId),
      ),
    );
    deleteImagePreviews(selectedIds);
    deleteProductDrafts(selectedIds);
    clearSelection();
    resetPage();
  };

  const hasPendingImageChanges = Array.from(imagePreviews.values()).some(
    (imagePreview) => imagePreview.file != null,
  );
  const hasPendingDraftChanges = productDrafts.size > 0 || removedIds.size > 0;
  const hasPendingChanges = hasPendingDraftChanges || hasPendingImageChanges;

  const resolveChangedProductImageObjectKeys = useCallback(async () => {
    const nextUploadedImageObjectKeys = new Map(uploadedImageObjectKeyRef.current);
    const productImageObjectKeys = new Map<string, string>();

    for (const [productId, imagePreview] of imagePreviews) {
      const cachedUpload = nextUploadedImageObjectKeys.get(productId);

      if (cachedUpload?.file === imagePreview.file) {
        productImageObjectKeys.set(productId, cachedUpload.objectKey);
        continue;
      }

      if (resolveProductImageFileObjectKey == null) {
        continue;
      }

      const objectKey = await resolveProductImageFileObjectKey(imagePreview.file);

      nextUploadedImageObjectKeys.set(productId, { file: imagePreview.file, objectKey });
      productImageObjectKeys.set(productId, objectKey);
    }

    uploadedImageObjectKeyRef.current = nextUploadedImageObjectKeys;

    return productImageObjectKeys;
  }, [imagePreviews, resolveProductImageFileObjectKey]);

  const saveCurrentDrafts = useCallback(
    async ({ force = false }: SaveCurrentDraftsOptions = {}) => {
      if (isLeavingRef.current) {
        return true;
      }

      if (onSaveDrafts == null) {
        return true;
      }

      try {
        const productImageObjectKeys = await resolveChangedProductImageObjectKeys();
        const request = createPreparedProductDraftSaveRequest({
          productImageObjectKeys,
          productDrafts,
          products: currentProducts,
        });
        const draftKey = JSON.stringify(request);

        if (!force && (!hasPendingChanges || draftKey === lastSavedDraftKeyRef.current)) {
          return true;
        }

        await onSaveDrafts(request);
        lastSavedDraftKeyRef.current = draftKey;

        return true;
      } catch {
        toast.error('임시 저장에 실패했습니다. 잠시 후 다시 시도해주세요.', {
          id: SAVE_DRAFT_ERROR_TOAST_ID,
        });

        return false;
      }
    },
    [
      currentProducts,
      hasPendingChanges,
      onSaveDrafts,
      productDrafts,
      resolveChangedProductImageObjectKeys,
      toast,
    ],
  );
  const saveCurrentDraftsRef = useRef(saveCurrentDrafts);
  const canAutoSave = onSaveDrafts != null;

  useEffect(() => {
    saveCurrentDraftsRef.current = saveCurrentDrafts;
  }, [saveCurrentDrafts]);

  useEffect(() => {
    if (!hasPendingChanges || !canAutoSave) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void saveCurrentDraftsRef.current();
    }, saveIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canAutoSave, hasPendingChanges, saveIntervalMs]);

  const handleRegister = async () => {
    const isSaved = await saveCurrentDrafts({ force: true });

    if (isSaved) {
      onRegister();
    }
  };
  const handlePrevious = () => {
    isLeavingRef.current = true;
    onPrevious();
  };

  return (
    <RegistrationResultSectionLayout
      needsEditCount={needsEditCount}
      registerDisabled={registerDisabled || isSavingDrafts}
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
        onProductFieldChange={changeProductField}
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
