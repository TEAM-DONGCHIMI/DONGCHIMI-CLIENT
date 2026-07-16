import type { PresignedUploadResponseTypes } from '@/shared/api';
import { PRODUCT_CATEGORY_CODE_BY_NAME } from '@/shared/constants/product-categories';

import type { RegisterDailyProductRequestTypes } from '../../api/register-daily-product';
import { isProductSelectableCategory } from '../../constants';
import {
  parsePriceInput,
  sanitizeProductDescription,
  sanitizeProductName,
} from './product-form.utils';
import type { TodaySpecialProductFormTypes } from './product-form.types';

export const DEFAULT_PRODUCT_THUMBNAIL_URL = '/images/product-replace.svg';

interface CreateDailyProductRequestParams {
  product: TodaySpecialProductFormTypes;
  s3BaseUrl: string | undefined;
  uploadedImageObjectKey: PresignedUploadResponseTypes['objectKey'] | null;
}

const getProductCategoryCode = (category: string) => {
  if (!isProductSelectableCategory(category)) {
    throw new Error(`Unsupported product category: ${category}`);
  }

  return PRODUCT_CATEGORY_CODE_BY_NAME[category];
};

const getUploadedProductImageUrl = (objectKey: string, s3BaseUrl: string | undefined) => {
  if (!s3BaseUrl) {
    throw new Error('VITE_PUBLIC_S3_BASE_URL is not configured.');
  }

  return `${s3BaseUrl.replace(/\/+$/, '')}/${objectKey.replace(/^\/+/, '')}`;
};

export const createDailyProductRequest = ({
  product,
  s3BaseUrl,
  uploadedImageObjectKey,
}: CreateDailyProductRequestParams): RegisterDailyProductRequestTypes => {
  const promotionalPhrase = sanitizeProductDescription(product.description);

  return {
    thumbnailUrl: uploadedImageObjectKey
      ? getUploadedProductImageUrl(uploadedImageObjectKey, s3BaseUrl)
      : DEFAULT_PRODUCT_THUMBNAIL_URL,
    name: sanitizeProductName(product.name),
    category: getProductCategoryCode(product.category),
    ...(promotionalPhrase ? { promotionalPhrase } : {}),
    originalPrice: parsePriceInput(product.salePrice),
    discountedPrice: parsePriceInput(product.specialPrice),
    discountStartDate: product.startDate,
    discountEndDate: product.startDate,
  };
};
