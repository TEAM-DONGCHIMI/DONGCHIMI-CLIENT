import { useState } from 'react';
import { useToast } from '@dongchimi/shared/toast';

import { normalizeApiError } from '@/shared/api';
import { useProductDiscountPeriodUpdateMutation } from './use-product-discount-period-update-mutation';

interface SubmitProductDiscountPeriodUpdateParams {
  endDate: string;
  marketId: number;
  productIds: number[];
  startDate: string;
}

const discountPeriodUpdateErrorMessages = {
  failed: '행사 기간을 수정하지 못했습니다. 다시 시도해주세요.',
  network: '인터넷 연결을 확인한 후 다시 시도해주세요.',
} as const;

const getDiscountPeriodUpdateErrorMessage = (error: unknown) => {
  const normalizedError = normalizeApiError(error);

  if (normalizedError.type === 'network') {
    return discountPeriodUpdateErrorMessages.network;
  }

  if (['auth', 'client', 'server', 'validation'].includes(normalizedError.type)) {
    return normalizedError.message || discountPeriodUpdateErrorMessages.failed;
  }

  return discountPeriodUpdateErrorMessages.failed;
};

export const useProductDiscountPeriodUpdateFlow = () => {
  const [isPending, setIsPending] = useState(false);
  const toast = useToast();
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
    } catch (error) {
      toast.error(getDiscountPeriodUpdateErrorMessage(error));

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
