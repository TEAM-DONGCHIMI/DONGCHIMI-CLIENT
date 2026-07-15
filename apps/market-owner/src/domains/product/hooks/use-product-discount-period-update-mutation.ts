import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateProductDiscountPeriod,
  type UpdateProductDiscountPeriodParams,
} from '../api/update-product-discount-period';
import { productQueryKeys } from '../query-keys';

export const useProductDiscountPeriodUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProductDiscountPeriodParams) => updateProductDiscountPeriod(params),
    onSuccess: (_response, { marketId, request }) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: productQueryKeys.listRoot }),
        ...request.productIds.map((productId) =>
          queryClient.invalidateQueries({
            queryKey: productQueryKeys.detail({ marketId, productId }),
          }),
        ),
      ]);
    },
  });
};
