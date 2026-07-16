import type { OwnerApiTypes } from '@/shared/api';
import {
  PRODUCT_CATEGORY_CODE_BY_NAME,
  PRODUCT_CATEGORY_NAME_BY_CODE,
  type ProductCategoryGroupTypes,
} from '@/shared/constants/product-categories';

import type { OwnerPreparedProductDraftResponseTypes } from '../../api/prepared-product-draft.schema';

export type RegistrationResultProductStatusTypes = 'completed' | 'needsEdit';

export type RegistrationResultEditableProductFieldTypes =
  | 'category'
  | 'discountPeriod'
  | 'price'
  | 'productName'
  | 'promotionText';

export type RegistrationResultProductDraftTypes = Partial<
  Record<RegistrationResultEditableProductFieldTypes, string>
>;

export type RegistrationResultProductDraftMapTypes = ReadonlyMap<
  string,
  RegistrationResultProductDraftTypes
>;

export interface RegistrationResultProduct {
  category: string;
  discountPeriod: string;
  id: string;
  imageAlt?: string;
  imageUrl?: string;
  price: string;
  productName: string;
  promotionText: string;
  status: RegistrationResultProductStatusTypes;
  statusReason?: string;
}

export interface RegistrationResultProductFieldValues {
  category: string;
  discountPeriod: string;
  price: string;
  productName: string;
  promotionText: string;
}

interface CreatePreparedProductDraftSaveRequestParams {
  productImageObjectKeys?: ReadonlyMap<string, string>;
  productDrafts: RegistrationResultProductDraftMapTypes;
  products: readonly RegistrationResultProduct[];
}

const DATE_RANGE_SEPARATOR = ' ~ ';

const formatProductPrice = (price?: number | null) => {
  return price == null ? '' : String(price);
};

const formatDiscountPeriod = (startDate?: string | null, endDate?: string | null) => {
  if (!startDate || !endDate) {
    return '';
  }

  return `${startDate}${DATE_RANGE_SEPARATOR}${endDate}`;
};

const parseDiscountPeriod = (discountPeriod: string) => {
  const [startDate = '', endDate = ''] = discountPeriod.split(DATE_RANGE_SEPARATOR);

  return {
    discountEndDate: endDate.trim() || null,
    discountStartDate: startDate.trim() || null,
  };
};

const normalizeOptionalText = (value: string) => {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

const normalizePrice = (value: string) => {
  const normalizedValue = value.replace(/\D/g, '');

  return normalizedValue.length > 0 ? Number(normalizedValue) : null;
};

const getProductFieldValue = (
  product: RegistrationResultProduct,
  drafts: RegistrationResultProductDraftMapTypes,
  field: RegistrationResultEditableProductFieldTypes,
) => {
  return drafts.get(product.id)?.[field] ?? product[field];
};

const getProductCategoryCode = (category: string) => {
  return PRODUCT_CATEGORY_CODE_BY_NAME[category as ProductCategoryGroupTypes];
};

export const getRegistrationResultProductFieldValue = (
  product: RegistrationResultProduct,
  drafts: RegistrationResultProductDraftMapTypes,
  field: RegistrationResultEditableProductFieldTypes,
) => {
  return drafts.get(product.id)?.[field] ?? product[field];
};

export const getRegistrationResultProductFieldValues = (
  product: RegistrationResultProduct,
  drafts: RegistrationResultProductDraftMapTypes,
): RegistrationResultProductFieldValues => {
  return {
    category: getRegistrationResultProductFieldValue(product, drafts, 'category'),
    discountPeriod: getRegistrationResultProductFieldValue(product, drafts, 'discountPeriod'),
    price: getRegistrationResultProductFieldValue(product, drafts, 'price'),
    productName: getRegistrationResultProductFieldValue(product, drafts, 'productName'),
    promotionText: getRegistrationResultProductFieldValue(product, drafts, 'promotionText'),
  };
};

export const createRegistrationResultProduct = (
  product: OwnerPreparedProductDraftResponseTypes,
): RegistrationResultProduct => {
  const productName = product.name ?? '';
  const category =
    product.category == null ? '' : (PRODUCT_CATEGORY_NAME_BY_CODE[product.category] ?? '기타');

  return {
    category,
    discountPeriod: formatDiscountPeriod(product.discountStartDate, product.discountEndDate),
    id: String(product.preparedProductId),
    imageAlt: product.thumbnailUrl == null ? undefined : `${productName || '상품'} 이미지`,
    imageUrl: product.thumbnailUrl ?? undefined,
    price: formatProductPrice(product.discountedPrice),
    productName,
    promotionText: product.promotionalPhrase ?? '',
    status: product.draftStatus === 'SUCCESS' ? 'completed' : 'needsEdit',
    statusReason: product.failReason ?? undefined,
  };
};

export const createRegistrationResultProducts = (
  products: readonly OwnerPreparedProductDraftResponseTypes[],
) => {
  return products.map(createRegistrationResultProduct);
};

export const createPreparedProductDraftSaveRequest = ({
  productImageObjectKeys,
  productDrafts,
  products,
}: CreatePreparedProductDraftSaveRequestParams): OwnerApiTypes.PreparedProductDraftSaveRequest => {
  const preparedProducts = products
    .map((product) => {
      const category = getProductFieldValue(product, productDrafts, 'category');
      const categoryCode = getProductCategoryCode(category);
      const discountPeriod = getProductFieldValue(product, productDrafts, 'discountPeriod');
      const { discountEndDate, discountStartDate } = parseDiscountPeriod(discountPeriod);
      const preparedProductId = Number(product.id);

      if (!Number.isSafeInteger(preparedProductId)) {
        return null;
      }

      const preparedProduct: OwnerApiTypes.PreparedProductDraftRequest = {
        preparedProductId,
        name: normalizeOptionalText(getProductFieldValue(product, productDrafts, 'productName')),
        thumbnailUrl: productImageObjectKeys?.get(product.id) ?? product.imageUrl ?? null,
        discountedPrice: normalizePrice(getProductFieldValue(product, productDrafts, 'price')),
        ...(categoryCode == null ? {} : { category: categoryCode }),
        promotionalPhrase: normalizeOptionalText(
          getProductFieldValue(product, productDrafts, 'promotionText'),
        ),
        discountStartDate,
        discountEndDate,
        dealType: 'PERIODIC' as const,
      };

      return preparedProduct;
    })
    .filter((product): product is OwnerApiTypes.PreparedProductDraftRequest => product != null);

  return { preparedProducts };
};
