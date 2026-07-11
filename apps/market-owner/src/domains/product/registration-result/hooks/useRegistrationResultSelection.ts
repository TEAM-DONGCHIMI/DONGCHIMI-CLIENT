import { useMemo, useState } from 'react';

import type { RegistrationResultProduct } from '../fixtures';

interface UseRegistrationResultSelectionParams {
  visibleProducts: readonly RegistrationResultProduct[];
}

export const useRegistrationResultSelection = ({
  visibleProducts,
}: UseRegistrationResultSelectionParams) => {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const selectedCount = useMemo(
    () => visibleProducts.filter((product) => selectedIds.has(product.id)).length,
    [selectedIds, visibleProducts],
  );
  const allVisibleSelected = visibleProducts.length > 0 && selectedCount === visibleProducts.length;
  const hasVisibleSelection = selectedCount > 0;

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const toggleVisibleSelection = () => {
    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      if (allVisibleSelected) {
        visibleProducts.forEach((product) => nextSelectedIds.delete(product.id));

        return nextSelectedIds;
      }

      visibleProducts.forEach((product) => nextSelectedIds.add(product.id));

      return nextSelectedIds;
    });
  };

  const changeRowChecked = (productId: string, checked: boolean) => {
    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      if (checked) {
        nextSelectedIds.add(productId);
      } else {
        nextSelectedIds.delete(productId);
      }

      return nextSelectedIds;
    });
  };

  return {
    action: {
      changeRowChecked,
      clearSelection,
      toggleVisibleSelection,
    },
    state: {
      allVisibleSelected,
      hasVisibleSelection,
      selectedCount,
      selectedIds,
    },
  };
};
