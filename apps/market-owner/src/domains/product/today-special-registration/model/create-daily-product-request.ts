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

const DEFAULT_PRODUCT_THUMBNAIL_URL = '/images/product-replace.svg';

interface CreateDailyProductRequestParams {
  product: TodaySpecialProductFormTypes;
  uploadedImageObjectKey: PresignedUploadResponseTypes['objectKey'] | null;
}

const getProductCategoryCode = (category: string) => {
  if (!isProductSelectableCategory(category)) {
    throw new Error(`Unsupported product category: ${category}`);
  }

  return PRODUCT_CATEGORY_CODE_BY_NAME[category];
};

export const createDailyProductRequest = ({
  product,
  uploadedImageObjectKey,
}: CreateDailyProductRequestParams): RegisterDailyProductRequestTypes => {
  const promotionalPhrase = sanitizeProductDescription(product.description);

  return {
    thumbnailUrl: uploadedImageObjectKey ?? DEFAULT_PRODUCT_THUMBNAIL_URL,
    name: sanitizeProductName(product.name),
    category: getProductCategoryCode(product.category),
    ...(promotionalPhrase ? { promotionalPhrase } : {}),
    originalPrice: parsePriceInput(product.salePrice),
    discountedPrice: parsePriceInput(product.specialPrice),
    discountStartDate: product.startDate,
    discountEndDate: product.startDate,
  };
};
