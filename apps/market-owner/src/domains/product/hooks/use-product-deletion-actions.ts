import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@dongchimi/shared/toast';

import { normalizeApiError } from '@/shared/api';
import { productQueryKeys } from '../query-keys';

import {
  useBulkProductDeletionMutation,
  useProductDeletionMutation,
} from './use-product-deletion-mutations';

const deletionErrorMessages = {
  failed: '상품을 삭제하지 못했습니다. 다시 시도해주세요.',
  network: '인터넷 연결을 확인한 후 다시 시도해주세요.',
} as const;

const hasInvalidProductId = (productIds: number[]) => {
  return (
    productIds.length === 0 || productIds.some((productId) => !Number.isSafeInteger(productId))
  );
};

export const useProductDeletionActions = (marketId: number) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const productDeletionMutation = useProductDeletionMutation();
  const bulkProductDeletionMutation = useBulkProductDeletionMutation();

  const showDeletionError = async (error: unknown) => {
    const normalizedError = await normalizeApiError(error);
    const message =
      normalizedError.type === 'network'
        ? deletionErrorMessages.network
        : normalizedError.message || deletionErrorMessages.failed;

    toast.error(message);
  };

  const invalidateProductLists = () => {
    return queryClient.invalidateQueries({ queryKey: productQueryKeys.listByMarket(marketId) });
  };

  const deleteProduct = async (productId: number) => {
    if (!Number.isSafeInteger(productId)) {
      toast.error(deletionErrorMessages.failed);

      return false;
    }

    try {
      await productDeletionMutation.mutateAsync({
        marketId,
        productId,
        request: { forceDelete: true },
      });
      await invalidateProductLists();

      return true;
    } catch (error) {
      await showDeletionError(error);

      return false;
    }
  };

  const deleteProducts = async (productIds: number[]) => {
    if (hasInvalidProductId(productIds)) {
      toast.error(deletionErrorMessages.failed);

      return false;
    }

    try {
      await bulkProductDeletionMutation.mutateAsync({
        marketId,
        request: { forceDelete: true, productIds },
      });
      await invalidateProductLists();

      return true;
    } catch (error) {
      await showDeletionError(error);

      return false;
    }
  };

  return {
    deleteProduct,
    deleteProducts,
    isDeletePending: productDeletionMutation.isPending || bulkProductDeletionMutation.isPending,
  };
};
