import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  savePreparedProductDrafts,
  type SavePreparedProductDraftsParams,
} from '../api/save-prepared-product-drafts';
import { productQueryKeys } from '../query-keys';

export const useSavePreparedProductDraftsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SavePreparedProductDraftsParams) => savePreparedProductDrafts(params),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: productQueryKeys.preparedDraftsRoot });
    },
  });
};
