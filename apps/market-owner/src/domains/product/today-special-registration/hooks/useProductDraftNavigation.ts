import type { Dispatch, SetStateAction } from 'react';

import { createEmptyTodaySpecialProductForm, type TodaySpecialProductFormTypes } from '../model';

interface UseProductDraftNavigationParams {
  appendProduct: (product: TodaySpecialProductFormTypes) => void;
  closeCategoryDropdown: () => void;
  currentIndex: number;
  productCount: number;
  removeProduct: (index: number) => void;
  revokeCurrentImagePreviewUrl: () => void;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

export const useProductDraftNavigation = ({
  appendProduct,
  closeCategoryDropdown,
  currentIndex,
  productCount,
  removeProduct,
  revokeCurrentImagePreviewUrl,
  setCurrentIndex,
}: UseProductDraftNavigationParams) => {
  // 새 빈 상품 draft를 추가하고 해당 draft로 이동
  const handleAddProduct = () => {
    appendProduct(createEmptyTodaySpecialProductForm());
    setCurrentIndex(productCount);
    closeCategoryDropdown();
  };

  // 이전 상품 draft로 이동
  const handlePreviousProduct = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
    closeCategoryDropdown();
  };

  // 다음 상품 draft로 이동
  const handleNextProduct = () => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, productCount - 1));
    closeCategoryDropdown();
  };

  // 현재 상품 draft를 제거하고 연결된 이미지 preview URL을 정리
  const handleRemoveCurrentProduct = () => {
    if (productCount <= 1) {
      return;
    }

    revokeCurrentImagePreviewUrl();
    removeProduct(currentIndex);
    setCurrentIndex((previousIndex) => Math.min(previousIndex, productCount - 2));
    closeCategoryDropdown();
  };

  return {
    actionSectionProps: {
      onAddProduct: handleAddProduct,
    },
    titleSectionProps: {
      currentIndex,
      onNextProduct: handleNextProduct,
      onPreviousProduct: handlePreviousProduct,
      onRemoveCurrentProduct: handleRemoveCurrentProduct,
      productCount,
    },
  };
};
