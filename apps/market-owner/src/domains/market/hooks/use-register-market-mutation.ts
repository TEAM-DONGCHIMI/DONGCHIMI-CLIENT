import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/stores/auth-store';

import { registerMarket, type RegisterMarketRequestTypes } from '../api';

export const useRegisterMarketMutation = () => {
  return useMutation({
    mutationFn: (request: RegisterMarketRequestTypes) => registerMarket(request),
    onSuccess: (response) => {
      useAuthStore.getState().setMarketId(response.data.marketId);
    },
  });
};
