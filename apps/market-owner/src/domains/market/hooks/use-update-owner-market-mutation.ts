import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/stores/auth-store';

import { updateOwnerMarket, type UpdateOwnerMarketParams } from '../api';
import { marketQueryKeys } from '../query-keys';

export const useUpdateOwnerMarketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateOwnerMarketParams) => updateOwnerMarket(params),
    onSuccess: (_response, { marketId, request }) => {
      const { account, setAccount } = useAuthStore.getState();

      if (account) {
        setAccount({
          ...account,
          marketName: request.name,
          marketThumbnailUrl: request.thumbnailUrl ?? undefined,
        });
      }

      return queryClient.invalidateQueries({ queryKey: marketQueryKeys.detail(marketId) });
    },
  });
};
