import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductDeletionActions, useProductEditTargetParam } from '@/domains/product/hooks';

import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  // TODO: 로그인 세션에서 담당 마트 ID를 제공하면 해당 값으로 교체합니다.
  const marketId = 1;
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
  const { deleteProducts, isDeletePending } = useProductDeletionActions(marketId);

  return (
    <ProductEditPageShell
      activeType='todaySpecial'
      deletePending={isDeletePending}
      onDeleteProducts={deleteProducts}
    >
      {(selectedFilter, _selectedCategory, selection) => (
        <TodaySpecialEditProductSection
          autoOpenProductId={targetProductId}
          marketId={marketId}
          selection={selection}
          selectedFilter={selectedFilter}
          onAutoOpenProductMissing={handleTargetProductMissing}
          onAutoOpenProductModalClose={clearTargetProductId}
        />
      )}
    </ProductEditPageShell>
  );
};
