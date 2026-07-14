import { useMutation } from '@tanstack/react-query';

import {
  startProductImport,
  type ProductImportRequestTypes,
  type ProductImportResponseTypes,
} from '../api';

interface StartProductImportMutationVariables {
  marketId: number | string;
  request: ProductImportRequestTypes;
}

export const useStartProductImportMutation = () => {
  return useMutation<ProductImportResponseTypes, Error, StartProductImportMutationVariables>({
    mutationFn: startProductImport,
  });
};
