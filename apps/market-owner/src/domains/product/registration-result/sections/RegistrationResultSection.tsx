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
import type { ResolveProductImageFileUrlTypes } from '../utils/resolve-product-image-file-url';
import { validateRegistrationResultProductFields } from '../utils/registration-result-product-validation';

interface RegistrationResultSummary {
  completedCount: number;
  needsEditCount: number;
  totalCount: number;
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
  resolveProductImageFileUrl?: ResolveProductImageFileUrlTypes;
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

const getMissingRequiredFieldReasons = ({
  hasProductImage,
  product,
}: {
  hasProductImage: boolean;
  product: RegistrationResultProduct;
}) => {
  const reasons: string[] = [];

  if (!hasProductImage) {
    reasons.push('이미지 미등록');
  }

  if (product.productName.trim().length === 0) {
    reasons.push('상품명 미입력');
  }

  if (product.price.trim().length === 0) {
    reasons.push('판매가격 미입력');
  }

  if (product.category.trim().length === 0) {
    reasons.push('카테고리 미입력');
  }

  if (product.discountPeriod.trim().length === 0) {
    reasons.push('할인 기간 미입력');
  }

  return reasons;
};

const createProductWithCurrentStatus = ({
  hasProductImage,
  product,
}: {
  hasProductImage: boolean;
  product: RegistrationResultProduct;
}): RegistrationResultProduct => {
  const fieldErrors = validateRegistrationResultProductFields(product);
  const missingRequiredFieldReasons = getMissingRequiredFieldReasons({ hasProductImage, product });
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
    statusReason:
      missingRequiredFieldReasons.length > 0
        ? missingRequiredFieldReasons.join(', ')
        : (Object.values(fieldErrors)[0] ?? product.statusReason),
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
  resolveProductImageFileUrl,
  onSaveDrafts,
}: RegistrationResultSectionProps) => {
  const toast = useToast();
  const uploadedImageUrlRef = useRef<ReadonlyMap<string, { file: File; imageUrl: string }>>(
    new Map(),
  );
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
        const hasProductImage = imagePreviews.has(product.id) || product.imageUrl != null;

        return createProductWithCurrentStatus({
          hasProductImage,
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
    uploadedImageUrlRef.current = new Map(
      Array.from(uploadedImageUrlRef.current).filter(([productId]) => !selectedIds.has(productId)),
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

  const resolveChangedProductImageUrls = useCallback(async () => {
    const nextUploadedImageUrls = new Map(uploadedImageUrlRef.current);
    const productImageUrls = new Map<string, string>();

    for (const [productId, imagePreview] of imagePreviews) {
      const cachedUpload = nextUploadedImageUrls.get(productId);

      if (cachedUpload?.file === imagePreview.file) {
        productImageUrls.set(productId, cachedUpload.imageUrl);
        continue;
      }

      if (resolveProductImageFileUrl == null) {
        continue;
      }

      const imageUrl = await resolveProductImageFileUrl(imagePreview.file);

      nextUploadedImageUrls.set(productId, { file: imagePreview.file, imageUrl });
      productImageUrls.set(productId, imageUrl);
    }

    uploadedImageUrlRef.current = nextUploadedImageUrls;

    return productImageUrls;
  }, [imagePreviews, resolveProductImageFileUrl]);

  const saveCurrentDrafts = useCallback(async () => {
    if (onSaveDrafts == null) {
      return true;
    }

    try {
      const productImageUrls = await resolveChangedProductImageUrls();
      const request = createPreparedProductDraftSaveRequest({
        productImageUrls,
        productDrafts,
        products: currentProducts,
      });
      const draftKey = JSON.stringify(request);

      if (!hasPendingChanges || draftKey === lastSavedDraftKeyRef.current) {
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
  }, [
    currentProducts,
    hasPendingChanges,
    onSaveDrafts,
    productDrafts,
    resolveChangedProductImageUrls,
    toast,
  ]);

  useEffect(() => {
    if (!hasPendingChanges || onSaveDrafts == null) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void saveCurrentDrafts();
    }, saveIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasPendingChanges, onSaveDrafts, saveCurrentDrafts, saveIntervalMs]);

  const handleRegister = async () => {
    const isSaved = await saveCurrentDrafts();

    if (isSaved) {
      onRegister();
    }
  };

  return (
    <RegistrationResultSectionLayout
      needsEditCount={needsEditCount}
      registerDisabled={registerDisabled || isSavingDrafts}
      onPrevious={onPrevious}
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
