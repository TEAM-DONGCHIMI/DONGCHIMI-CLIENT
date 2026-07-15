import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/stores/auth-store';

import { loginMarketOwner } from '../api/auth-api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginMarketOwner,
    onSuccess: (response, variables) => {
      useAuthStore.getState().setAccessToken(response.data.accessToken, {
        account: {
          email: response.data.email,
          marketName: response.data.marketName ?? undefined,
          marketThumbnailUrl: response.data.marketThumbnailUrl ?? undefined,
        },
        isAutoLogin: variables.isAutoLogin,
        marketId: response.data.marketId,
      });
    },
  });
};
