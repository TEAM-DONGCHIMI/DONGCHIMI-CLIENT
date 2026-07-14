import type { PresignedUploadResponseTypes } from '@/shared/api';

import type { RegisterDailyProductRequestTypes } from '../../api/register-daily-product';
import { isProductSelectableCategory, type ProductSelectableCategoryTypes } from '../../constants';
import {
  parsePriceInput,
  sanitizeProductDescription,
  sanitizeProductName,
} from './product-form.utils';
import type { TodaySpecialProductFormTypes } from './product-form.types';

// TODO: 이미지 확정시 교체
const DEFAULT_PRODUCT_THUMBNAIL_URL = '/images/product-empty.png';

const productCategoryCodeByLabel = {
  '채소･과일': 'VEGETABLE_FRUIT',
  '정육･달걀': 'MEAT_EGG',
  수산: 'SEAFOOD',
  유제품: 'DAIRY',
  간편식: 'CONVENIENCE_FOOD',
  가공식품: 'PROCESSED_FOOD',
  '음료･주류': 'BEVERAGE_ALCOHOL',
  생활용품: 'HOUSEHOLD_GOODS',
  기타: 'ETC',
} as const satisfies Record<
  ProductSelectableCategoryTypes,
  RegisterDailyProductRequestTypes['category']
>;

interface CreateDailyProductRequestParams {
  product: TodaySpecialProductFormTypes;
  uploadedImageObjectKey: PresignedUploadResponseTypes['objectKey'] | null;
}

const getProductCategoryCode = (category: string) => {
  if (!isProductSelectableCategory(category)) {
    throw new Error(`Unsupported product category: ${category}`);
  }

  return productCategoryCodeByLabel[category];
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
