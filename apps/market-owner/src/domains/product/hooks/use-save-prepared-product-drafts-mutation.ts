import { useMutation } from '@tanstack/react-query';

import {
  savePreparedProductDrafts,
  type SavePreparedProductDraftsParams,
} from '../api/save-prepared-product-drafts';
export const useSavePreparedProductDraftsMutation = () => {
  return useMutation({
    mutationFn: (params: SavePreparedProductDraftsParams) => savePreparedProductDrafts(params),
  });
};
