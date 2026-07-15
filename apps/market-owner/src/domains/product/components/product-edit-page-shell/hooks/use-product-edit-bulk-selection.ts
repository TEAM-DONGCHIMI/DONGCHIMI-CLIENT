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
  marketId?: number;
  periodBaseProduct?: ProductEditCardProps;
  onDeleteProducts?: (productIds: number[]) => Promise<boolean>;
  onResetProducts?: () => Promise<boolean>;
  onUpdateProductPeriods?: (
    productNames: string[],
    period: { endDate: string; startDate: string },
  ) => void;
}

export interface ProductEditPageSelectionControls {
  selectedProductIds: number[];
  selectedProductNames: string[];
  selectionMode: boolean;
  onToggleProductSelection: (product: ProductEditCardProps) => void;
}

export const useProductEditBulkSelection = ({
  activeType,
  marketId,
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
  const selectedProductIds = selectedProducts
    .map(({ productId }) => Number(productId))
    .filter(Number.isSafeInteger);
  const selectedProductNames = selectedProducts.map((product) => product.productName);

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
        (currentProduct) => currentProduct.productId === product.productId,
      );

      const products = isSelected
        ? currentSelection.products.filter(
            (currentProduct) => currentProduct.productId !== product.productId,
          )
        : [...currentSelection.products, product];

      return {
        ...currentSelection,
        products,
      };
    });
  };

  const selectionControls: ProductEditPageSelectionControls = {
    selectedProductIds,
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

    if (marketId == null) {
      return;
    }

    if (selectedProductIds.length !== selectedProductCount) {
      return;
    }

    openProductEditPeriodModal({
      initialPeriod: selectedProducts[0] ?? periodBaseProduct,
      marketId,
      productIds: selectedProductIds,
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

    if (selectedProductIds.length !== selectedProductCount) {
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
      onConfirm: async () => {
        const isReset = await onResetProducts?.();

        if (isReset !== false) {
          closeBulkAction();
        }
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
