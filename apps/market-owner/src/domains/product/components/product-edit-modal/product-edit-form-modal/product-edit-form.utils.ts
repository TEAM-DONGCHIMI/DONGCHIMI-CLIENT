import { type ProductUpdateFormValuesTypes } from '@/domains/product/model/create-product-update-request';
import { type OwnerApiTypes } from '@/shared/api';
import { PRODUCT_CATEGORY_NAME_BY_CODE } from '@/shared/constants/product-categories';

import { formatProductEditDateForInput } from '../../../utils/product-date';
import { sanitizeProductName } from '../../../utils/product-input';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
} from '../../product-edit-product-list';

export interface ProductEditFormValues extends ProductUpdateFormValuesTypes {
  endDate: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
}

export const createProductEditInitialValues = (
  detail: OwnerApiTypes.OwnerProductDetailResponse,
): ProductEditFormValues => {
  const categoryName = PRODUCT_CATEGORY_NAME_BY_CODE[detail.category];

  return {
    categoryName,
    endDate: formatProductEditDateForInput(detail.discountEndDate),
    imageFile: null,
    imagePreviewUrl: detail.thumbnailUrl ?? null,
    originalPrice: detail.originalPrice.toLocaleString('ko-KR'),
    productName: detail.name,
    promotionText: detail.promotionalPhrase ?? '',
    salePrice: detail.discountedPrice.toLocaleString('ko-KR'),
    startDate: formatProductEditDateForInput(detail.discountStartDate),
  };
};

export const isSameProductEditFormValues = (
  values: ProductEditFormValues,
  initialValues: ProductEditFormValues,
) => {
  return (Object.keys(initialValues) as (keyof ProductEditFormValues)[]).every(
    (key) => values[key] === initialValues[key],
  );
};

const parseProductPrice = (value: string | undefined) => {
  if (value == null) {
    return undefined;
  }

  return Number(value.replaceAll(',', ''));
};

const calculateProductDiscountRate = (originalPrice: number, salePrice: number) => {
  if (originalPrice <= 0) {
    return undefined;
  }

  return String(Math.max(0, Math.round(((originalPrice - salePrice) / originalPrice) * 100)));
};

export const createUpdatedProductCard = ({
  product,
  values,
  variant,
}: {
  product: ProductEditCardProps;
  values: ProductEditFormValues;
  variant: ProductEditCardVariantTypes;
}): ProductEditCardProps => {
  const originalPrice = parseProductPrice(values.originalPrice);
  const salePrice = parseProductPrice(values.salePrice) ?? 0;

  return {
    ...product,
    categoryName: values.categoryName,
    endDate: values.endDate,
    originalPrice: variant === 'todaySpecial' ? values.originalPrice : undefined,
    productName: sanitizeProductName(values.productName),
    salePercent:
      variant === 'todaySpecial' && originalPrice != null
        ? calculateProductDiscountRate(originalPrice, salePrice)
        : undefined,
    salePrice: values.salePrice,
    startDate: values.startDate,
  };
};
