import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/stores/auth-store';

import { loginMarketOwner } from '../api/auth-api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginMarketOwner,
    onSuccess: (response, variables) => {
      const authStore = useAuthStore.getState();

      authStore.setAccessToken(response.data.accessToken, { isAutoLogin: variables.isAutoLogin });
      authStore.setMarketId(response.data.marketId ?? undefined);
    },
  });
};
