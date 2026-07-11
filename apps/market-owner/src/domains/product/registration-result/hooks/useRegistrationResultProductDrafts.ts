import { useState } from 'react';

import type { RegistrationResultProduct } from '../fixtures';

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

export const getRegistrationResultProductFieldValue = (
  product: RegistrationResultProduct,
  drafts: RegistrationResultProductDraftMapTypes,
  field: RegistrationResultEditableProductFieldTypes,
) => {
  return drafts.get(product.id)?.[field] ?? product[field];
};

export const useRegistrationResultProductDrafts = () => {
  const [productDrafts, setProductDrafts] = useState<RegistrationResultProductDraftMapTypes>(
    new Map(),
  );

  const changeProductField = (
    productId: string,
    field: RegistrationResultEditableProductFieldTypes,
    value: string,
  ) => {
    setProductDrafts((previousDrafts) => {
      const previousProductDraft = previousDrafts.get(productId);
      const nextProductDraft = { ...previousProductDraft, [field]: value };
      const nextDrafts = new Map(previousDrafts);

      nextDrafts.set(productId, nextProductDraft);

      return nextDrafts;
    });
  };

  const deleteProductDrafts = (productIds: Iterable<string>) => {
    setProductDrafts((previousDrafts) => {
      const nextDrafts = new Map(previousDrafts);

      Array.from(productIds).forEach((productId) => nextDrafts.delete(productId));

      return nextDrafts;
    });
  };

  return {
    action: {
      changeProductField,
      deleteProductDrafts,
    },
    state: {
      productDrafts,
    },
  };
};
