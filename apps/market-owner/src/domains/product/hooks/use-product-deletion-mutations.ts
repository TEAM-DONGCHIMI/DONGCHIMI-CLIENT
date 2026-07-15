import { useMutation } from '@tanstack/react-query';

import {
  deleteProduct,
  deleteProducts,
  type DeleteProductParams,
  type DeleteProductsParams,
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
