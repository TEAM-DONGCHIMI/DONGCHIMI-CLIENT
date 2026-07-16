import { useCallback, useEffect, useRef } from 'react';

import { openProductEditConfirmModal, openProductEditModal } from '../product-edit-modal';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
  type ProductEditProductGroup,
} from './display-groups';

interface UseProductEditListActionsParams {
  autoOpenProductId?: string | null;
  groups: ProductEditProductGroup[];
  marketId: number;
  variant: ProductEditCardVariantTypes;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
  onDeleteProduct?: (product: ProductEditCardProps) => void;
  onUpdateProduct?: (productId: number, product: ProductEditCardProps) => void;
}

const parseProductId = (value: ProductEditCardProps['productId']) => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  const productId = Number(value);

  return Number.isSafeInteger(productId) && productId > 0 ? productId : null;
};

export const useProductEditListActions = ({
  autoOpenProductId,
  groups,
  marketId,
  variant,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
  onUpdateProduct,
}: UseProductEditListActionsParams) => {
  const openedProductIdRef = useRef<string | null>(null);

  const openEditProduct = useCallback(
    (product: ProductEditCardProps, onClose?: () => void) => {
      const productId = parseProductId(product.productId);

      if (productId == null) {
        return false;
      }

      openProductEditModal({
        marketId,
        product,
        productId,
        variant,
        onClose,
        onSubmit: (updatedProduct) => onUpdateProduct?.(productId, updatedProduct),
      });

      return true;
    },
    [marketId, onUpdateProduct, variant],
  );

  useEffect(() => {
    if (autoOpenProductId == null) {
      openedProductIdRef.current = null;

      return;
    }

    if (openedProductIdRef.current === autoOpenProductId) {
      return;
    }

    const targetProduct = groups
      .flatMap((group) => group.products)
      .find((product) => String(product.productId) === autoOpenProductId);

    openedProductIdRef.current = autoOpenProductId;

    if (targetProduct == null || !openEditProduct(targetProduct, onAutoOpenProductModalClose)) {
      onAutoOpenProductMissing?.(autoOpenProductId);
    }
  }, [
    autoOpenProductId,
    groups,
    onAutoOpenProductMissing,
    onAutoOpenProductModalClose,
    openEditProduct,
  ]);

  const requestDeleteProduct = useCallback(
    (product: ProductEditCardProps) => {
      openProductEditConfirmModal({
        action: 'delete',
        onConfirm: () => onDeleteProduct?.(product),
      });
    },
    [onDeleteProduct],
  );

  return {
    onDeleteProduct: requestDeleteProduct,
    onEditProduct: openEditProduct,
  };
};
