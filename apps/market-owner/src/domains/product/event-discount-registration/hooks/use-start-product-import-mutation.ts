import { useMutation } from '@tanstack/react-query';

import { startProductImport } from '../api';

export const useStartProductImportMutation = () => {
  return useMutation({
    mutationFn: startProductImport,
  });
};
