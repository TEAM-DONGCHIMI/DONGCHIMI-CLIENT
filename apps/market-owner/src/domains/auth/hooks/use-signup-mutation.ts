import { useMutation } from '@tanstack/react-query';

import { signupMarketOwner } from '../api/auth-api';

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupMarketOwner,
  });
};
