import { PRODUCT_CATEGORY_CODE_BY_NAME } from '@/shared/constants/product-categories';

import type { UpdateProductRequestTypes } from '../api/update-product';
import type { ProductSelectableCategoryTypes } from '../constants';
import { sanitizeProductName, sanitizeProductPromotionText } from '../utils/product-input';

export interface ProductUpdateFormValuesTypes {
  categoryName: ProductSelectableCategoryTypes;
  endDate: string;
  originalPrice: string;
  productName: string;
  promotionText: string;
  salePrice: string;
  startDate: string;
}

interface CreateProductUpdateRequestParams {
  dealType: UpdateProductRequestTypes['type'];
  thumbnailUrl: string | null;
  values: ProductUpdateFormValuesTypes;
}

const parseProductPrice = (value: string) => Number(value.replaceAll(',', ''));

export const createProductUpdateRequest = ({
  dealType,
  thumbnailUrl,
  values,
}: CreateProductUpdateRequestParams): UpdateProductRequestTypes => {
  const promotionalPhrase = sanitizeProductPromotionText(values.promotionText);
  const commonRequest = {
    type: dealType,
    thumbnailUrl,
    name: sanitizeProductName(values.productName),
    category: PRODUCT_CATEGORY_CODE_BY_NAME[values.categoryName],
    promotionalPhrase: promotionalPhrase || null,
    discountedPrice: parseProductPrice(values.salePrice),
    discountStartDate: values.startDate,
    discountEndDate: values.endDate,
  } satisfies UpdateProductRequestTypes;

  if (dealType === 'PERIODIC') {
    return commonRequest;
  }

  return {
    ...commonRequest,
    originalPrice: parseProductPrice(values.originalPrice),
  };
};
