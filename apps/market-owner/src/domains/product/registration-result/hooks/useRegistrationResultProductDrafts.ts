import { useState } from 'react';

import type {
  RegistrationResultEditableProductFieldTypes,
  RegistrationResultProductDraftMapTypes,
} from '../model';

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
