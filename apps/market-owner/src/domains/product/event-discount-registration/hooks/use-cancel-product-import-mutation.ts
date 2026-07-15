import { useMutation } from '@tanstack/react-query';

import { cancelProductImport, type CancelProductImportParams } from '../api';

type CancelProductImportTypes = (params: CancelProductImportParams) => Promise<void>;

export const useCancelProductImportMutation = (
  mutationFn: CancelProductImportTypes = cancelProductImport,
) => {
  return useMutation({
    mutationFn,
  });
};
