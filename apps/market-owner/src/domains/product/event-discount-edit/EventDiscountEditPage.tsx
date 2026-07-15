import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductDeletionActions, useProductEditTargetParam } from '@/domains/product/hooks';

import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  // TODO: 로그인 세션에서 담당 마트 ID를 제공하면 해당 값으로 교체합니다.
  const marketId = 1;
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
  const { deleteProducts, isDeletePending } = useProductDeletionActions(marketId);

  return (
    <ProductEditPageShell
      activeType='eventDiscount'
      deletePending={isDeletePending}
      onDeleteProducts={deleteProducts}
    >
      {(selectedFilter, selectedCategory, selection) => (
        <EventDiscountEditProductSection
          autoOpenProductId={targetProductId}
          marketId={marketId}
          selection={selection}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onAutoOpenProductMissing={handleTargetProductMissing}
          onAutoOpenProductModalClose={clearTargetProductId}
        />
      )}
    </ProductEditPageShell>
  );
};
