import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

const PRODUCT_EDIT_TARGET_PRODUCT_ID_PARAM = 'productId';
const PRODUCT_EDIT_TARGET_MISSING_MESSAGE = '상품 정보를 불러오지 못했어요.';

export const useProductEditTargetParam = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetProductId = searchParams.get(PRODUCT_EDIT_TARGET_PRODUCT_ID_PARAM);

  const clearTargetProductId = useCallback(() => {
    setSearchParams(
      (currentSearchParams) => {
        const nextSearchParams = new URLSearchParams(currentSearchParams);
        nextSearchParams.delete(PRODUCT_EDIT_TARGET_PRODUCT_ID_PARAM);

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
