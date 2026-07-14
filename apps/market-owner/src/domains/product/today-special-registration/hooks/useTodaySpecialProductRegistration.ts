import { useToast } from '@dongchimi/shared/toast';

import { normalizeApiError } from '@/shared/api';
import { getMarketOwnerEnv } from '@/shared/config';

import { useDailyProductRegistrationMutation } from '../../hooks/use-daily-product-registration-mutation';
import { createDailyProductRequest, type TodaySpecialProductFormTypes } from '../model';
import { useTodaySpecialImageUpload } from './useTodaySpecialImageUpload';

const registrationErrorMessages = {
  failed: '상품을 등록하지 못했습니다. 다시 시도해주세요.',
  network: '인터넷 연결을 확인한 후 다시 시도해주세요.',
} as const;

// TODO: 마트 등록 api 구현 후 교체
const TEMPORARY_MARKET_ID = 1;

type RegistrationResultTypes = { success: true } | { success: false };

export const useTodaySpecialProductRegistration = () => {
  const toast = useToast();
  const { uploadProductImage } = useTodaySpecialImageUpload();
  const dailyProductRegistrationMutation = useDailyProductRegistrationMutation();

  const registerProduct = async (
    product: TodaySpecialProductFormTypes,
  ): Promise<RegistrationResultTypes> => {
    try {
      const uploadedImageObjectKey = await uploadProductImage(product);
      const { s3BaseUrl } = getMarketOwnerEnv();

      await dailyProductRegistrationMutation.mutateAsync({
        marketId: TEMPORARY_MARKET_ID,
        request: createDailyProductRequest({ product, s3BaseUrl, uploadedImageObjectKey }),
      });

      return { success: true };
    } catch (error) {
      const normalizedError = await normalizeApiError(error);
      const message =
        normalizedError.type === 'network'
          ? registrationErrorMessages.network
          : registrationErrorMessages.failed;

      toast.error(message);

      return { success: false };
    }
  };

  return { registerProduct };
};
