import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/stores/auth-store';

import { loginMarketOwner } from '../api/auth-api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginMarketOwner,
    onSuccess: (response) => {
      useAuthStore.getState().setAccessToken(response.data.accessToken);
    },
  });
};
