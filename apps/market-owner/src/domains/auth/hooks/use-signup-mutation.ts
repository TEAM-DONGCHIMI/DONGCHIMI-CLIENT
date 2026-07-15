import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/stores/auth-store';

import { signupMarketOwner } from '../api/auth-api';

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupMarketOwner,
    onSuccess: (response) => {
      useAuthStore.getState().setAccessToken(response.data.accessToken, {
        account: {
          email: response.data.email,
          marketName: response.data.marketName ?? undefined,
          marketThumbnailUrl: response.data.marketThumbnailUrl ?? undefined,
        },
        isAutoLogin: true,
        marketId: response.data.marketId,
      });
    },
  });
};
