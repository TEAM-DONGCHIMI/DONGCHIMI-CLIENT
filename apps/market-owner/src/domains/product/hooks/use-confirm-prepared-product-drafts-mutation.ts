import { useMutation, useQueryClient } from '@tanstack/react-query';

import { confirmPreparedProductDrafts } from '../api/confirm-prepared-product-drafts';
import { productQueryKeys } from '../query-keys';

export const useConfirmPreparedProductDraftsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (marketId: number) => confirmPreparedProductDrafts(marketId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};
