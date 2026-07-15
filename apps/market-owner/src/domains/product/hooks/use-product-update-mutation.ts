import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProduct, type UpdateProductParams } from '../api/update-product';
import { productQueryKeys } from '../query-keys';

export const useProductUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProductParams) => updateProduct(params),
    onSuccess: (_response, { marketId, productId }) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: productQueryKeys.listRoot }),
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.detail({ marketId, productId }),
        }),
      ]);
    },
  });
};
