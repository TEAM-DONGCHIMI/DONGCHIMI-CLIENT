import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateOwnerMarket, type UpdateOwnerMarketParams } from '../api';
import { marketQueryKeys } from '../query-keys';

export const useUpdateOwnerMarketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateOwnerMarketParams) => updateOwnerMarket(params),
    onSuccess: (_response, { marketId }) => {
      return queryClient.invalidateQueries({ queryKey: marketQueryKeys.detail(marketId) });
    },
  });
};
