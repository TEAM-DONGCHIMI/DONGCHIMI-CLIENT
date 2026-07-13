import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

import { MARKET_OWNER_ROUTE_SEARCH_PARAMS } from '@/shared/constants/routes';

const PRODUCT_EDIT_TARGET_MISSING_MESSAGE = '상품 정보를 불러오지 못했어요.';

export const useProductEditTargetParam = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetProductId = searchParams.get(
    MARKET_OWNER_ROUTE_SEARCH_PARAMS.productEditTargetProductId,
  );

  const clearTargetProductId = useCallback(() => {
    setSearchParams(
      (currentSearchParams) => {
        const nextSearchParams = new URLSearchParams(currentSearchParams);
        nextSearchParams.delete(MARKET_OWNER_ROUTE_SEARCH_PARAMS.productEditTargetProductId);

        return nextSearchParams;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const handleTargetProductMissing = useCallback(() => {
    toast.error(PRODUCT_EDIT_TARGET_MISSING_MESSAGE);
    clearTargetProductId();
  }, [clearTargetProductId, toast]);

  return {
    clearTargetProductId,
    handleTargetProductMissing,
    targetProductId,
  };
};
