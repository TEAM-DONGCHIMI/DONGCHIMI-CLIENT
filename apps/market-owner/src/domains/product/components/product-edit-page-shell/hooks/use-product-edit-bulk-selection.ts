import { useState } from 'react';

import { openProductEditConfirmModal, openProductEditPeriodModal } from '../../product-edit-modal';
import { type ProductEditCardProps } from '../../product-edit-product-list';
import { type ProductEditTypeTypes } from '../ProductEditPageShell.constants';

export type ProductEditBulkActionTypes = 'delete' | 'period';

interface ProductEditBulkSelectionState {
  action: ProductEditBulkActionTypes | null;
  products: ProductEditCardProps[];
}

interface UseProductEditBulkSelectionParams {
  activeType: ProductEditTypeTypes;
  periodBaseProduct?: ProductEditCardProps;
  onDeleteProducts?: (productIds: number[]) => Promise<boolean>;
  onResetProducts?: () => void;
  onUpdateProductPeriods?: (
    productNames: string[],
    period: { endDate: string; startDate: string },
  ) => void;
}

export interface ProductEditPageSelectionControls {
  selectedProductNames: string[];
  selectionMode: boolean;
  onToggleProductSelection: (product: ProductEditCardProps) => void;
}

export const useProductEditBulkSelection = ({
  activeType,
  periodBaseProduct,
  onDeleteProducts,
  onResetProducts,
  onUpdateProductPeriods,
}: UseProductEditBulkSelectionParams) => {
  // 일괄 작업 상태
  const [bulkSelection, setBulkSelection] = useState<ProductEditBulkSelectionState>({
    action: null,
    products: [],
  });
  const bulkAction = bulkSelection.action;
  const selectedProducts = bulkSelection.products;

  // 일괄 작업 파생값
  const selectionMode = bulkAction != null;
  const selectedProductCount = selectedProducts.length;
  const selectedProductNames = selectedProducts.map((product) => product.productName); // 선택 상품 이름만
  const selectedProductIds = selectedProducts.map((product) => Number(product.productId));

  // 일괄 작업 닫기
  const closeBulkAction = () => {
    setBulkSelection({
      action: null,
      products: [],
    });
  };

  // 일괄 작업 시작
  const startBulkAction = (nextBulkAction: ProductEditBulkActionTypes) => {
    setBulkSelection({
      action: nextBulkAction,
      products: [],
    });
  };

  // 카드 선택 토글
  const toggleProductSelection = (product: ProductEditCardProps) => {
    setBulkSelection((currentSelection) => {
      const isSelected = currentSelection.products.some(
        (currentProduct) => currentProduct.productName === product.productName,
      );

      const products = isSelected
        ? currentSelection.products.filter(
            (currentProduct) => currentProduct.productName !== product.productName,
          )
        : [...currentSelection.products, product];

      return {
        ...currentSelection,
        products,
      };
    });
  };

  const selectionControls: ProductEditPageSelectionControls = {
    selectedProductNames,
    selectionMode,
    onToggleProductSelection: toggleProductSelection,
  };

  // 기간 일괄 수정 액션
  const openPeriodBulkAction = () => {
    if (bulkAction !== 'period') {
      startBulkAction('period');
      return;
    }

    if (selectedProductCount === 0) {
      closeBulkAction();
      return;
    }

    openProductEditPeriodModal({
      initialPeriod: selectedProducts[0] ?? periodBaseProduct,
      variant: activeType,
      onSubmit: (period) => {
        onUpdateProductPeriods?.(selectedProductNames, period);
      },
      onClose: closeBulkAction,
    });
  };

  // 일괄 삭제 액션
  const openDeleteBulkAction = () => {
    if (bulkAction !== 'delete') {
      startBulkAction('delete');
      return;
    }

    if (selectedProductCount === 0) {
      closeBulkAction();
      return;
    }

    openProductEditConfirmModal({
      action: 'delete',
      onConfirm: async () => {
        const isDeleted = await onDeleteProducts?.(selectedProductIds);

        if (isDeleted !== false) {
          closeBulkAction();
        }
      },
    });
  };

  const openResetConfirm = () => {
    openProductEditConfirmModal({
      action: 'reset',
      onConfirm: () => {
        onResetProducts?.();
        closeBulkAction();
      },
    });
  };

  return {
    bulkAction,
    selectedProductCount,
    selectionControls,
    selectionMode,
    openDeleteBulkAction,
    openPeriodBulkAction,
    openResetConfirm,
  };
};
