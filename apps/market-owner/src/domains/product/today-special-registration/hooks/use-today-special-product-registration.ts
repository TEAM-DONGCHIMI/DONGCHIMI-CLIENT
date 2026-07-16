import { IcCircleExclamation } from '@dongchimi/design-system/icons';
import { useToast } from '@dongchimi/shared/toast';
import { createElement, type SVGProps } from 'react';

import { normalizeApiError } from '@/shared/api';

import { useDailyProductRegistrationMutation } from '../../hooks/use-daily-product-registration-mutation';
import {
  createDailyProductRequest,
  DEFAULT_PRODUCT_THUMBNAIL_URL,
  type TodaySpecialProductFormTypes,
} from '../model';
import { useTodaySpecialImageUpload } from './use-today-special-image-upload';

const registrationErrorMessages = {
  failed: '상품을 등록하지 못했습니다. 다시 시도해주세요.',
  network: '인터넷 연결을 확인한 후 다시 시도해주세요.',
} as const;

type RegistrationResultTypes =
  | { productId: number; success: true; thumbnailUrl: string }
  | { success: false };

export const useTodaySpecialProductRegistration = (marketId: number) => {
  const toast = useToast();
  const { uploadProductImage } = useTodaySpecialImageUpload();
  const dailyProductRegistrationMutation = useDailyProductRegistrationMutation();

  const registerProduct = async (
    product: TodaySpecialProductFormTypes,
  ): Promise<RegistrationResultTypes> => {
    try {
      const uploadedImageObjectKey = await uploadProductImage(product);

      const request = createDailyProductRequest({ product, uploadedImageObjectKey });
      const requestThumbnailUrl = request.thumbnailUrl;

      if (requestThumbnailUrl == null) {
        throw new Error('Product thumbnail URL is required.');
      }

      const response = await dailyProductRegistrationMutation.mutateAsync({
        marketId,
        request,
      });

      return {
        productId: response.data.productId,
        success: true,
        thumbnailUrl: response.data.thumbnailUrl ?? DEFAULT_PRODUCT_THUMBNAIL_URL,
      };
    } catch (error) {
      const normalizedError = await normalizeApiError(error);
      const message =
        normalizedError.type === 'network'
          ? registrationErrorMessages.network
          : registrationErrorMessages.failed;

      toast.error(message, {
        icon: createElement(IcCircleExclamation, {
          'data-testid': 'today-special-registration-error-toast-icon',
        } as SVGProps<SVGSVGElement>),
      });

      return { success: false };
    }
  };

  return { registerProduct };
};
