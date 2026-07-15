import { useMutation } from '@tanstack/react-query';

import { registerMarket, type RegisterMarketRequestTypes } from '../api';

export const useRegisterMarketMutation = () => {
  return useMutation({
    mutationFn: (request: RegisterMarketRequestTypes) => registerMarket(request),
  });
};
