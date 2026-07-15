import { useState } from 'react';

import { useProductDiscountPeriodUpdateMutation } from './use-product-discount-period-update-mutation';

interface SubmitProductDiscountPeriodUpdateParams {
  endDate: string;
  marketId: number;
  productIds: number[];
  startDate: string;
}

export const useProductDiscountPeriodUpdateFlow = () => {
  const [isPending, setIsPending] = useState(false);
  const updateMutation = useProductDiscountPeriodUpdateMutation();

  const submitProductDiscountPeriodUpdate = async ({
    endDate,
    marketId,
    productIds,
    startDate,
  }: SubmitProductDiscountPeriodUpdateParams) => {
    if (isPending || productIds.length === 0) {
      return false;
    }

    setIsPending(true);

    try {
      await updateMutation.mutateAsync({
        marketId,
        request: {
          discountStartDate: startDate,
          discountEndDate: endDate,
          productIds,
        },
      });

      return true;
    } catch {
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    submitProductDiscountPeriodUpdate,
  };
};
