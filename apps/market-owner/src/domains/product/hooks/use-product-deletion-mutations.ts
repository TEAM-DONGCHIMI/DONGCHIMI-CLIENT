import { useMutation } from '@tanstack/react-query';

import {
  deleteProduct,
  deleteProducts,
  resetProducts,
  type DeleteProductParams,
  type DeleteProductsParams,
  type ResetProductsParams,
} from '../api/delete-products';

export const useProductDeletionMutation = () => {
  return useMutation({
    mutationFn: (params: DeleteProductParams) => deleteProduct(params),
  });
};

export const useBulkProductDeletionMutation = () => {
  return useMutation({
    mutationFn: (params: DeleteProductsParams) => deleteProducts(params),
  });
};

export const useProductResetMutation = () => {
  return useMutation({
    mutationFn: (params: ResetProductsParams) => resetProducts(params),
  });
};
