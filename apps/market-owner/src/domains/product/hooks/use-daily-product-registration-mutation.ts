import { useMutation } from '@tanstack/react-query';

import {
  registerDailyProduct,
  type RegisterDailyProductParams,
} from '../api/register-daily-product';

export const useDailyProductRegistrationMutation = () => {
  return useMutation({
    mutationFn: (params: RegisterDailyProductParams) => registerDailyProduct(params),
  });
};
