import { useMutation } from '@tanstack/react-query';

import { loginMarketOwner } from '../api/auth-api';
import { authTokenStorage } from '../model/auth-token-storage';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginMarketOwner,
    onSuccess: (response, variables) => {
      authTokenStorage.setAccessToken(response.data.accessToken, {
        persist: variables.isAutoLogin,
      });
    },
  });
};
