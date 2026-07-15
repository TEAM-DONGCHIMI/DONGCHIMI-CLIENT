import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  registerDailyProduct,
  type RegisterDailyProductParams,
} from '../api/register-daily-product';
import { productQueryKeys } from '../query-keys';

export const useDailyProductRegistrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RegisterDailyProductParams) => registerDailyProduct(params),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: productQueryKeys.listRoot });
    },
  });
};
