import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditTargetParam } from '@/domains/product/hooks';

import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
  return (
    <ProductEditPageShell activeType='todaySpecial'>
      {(selectedFilter, _selectedCategory, selection) => (
        <TodaySpecialEditProductSection
          autoOpenProductId={targetProductId}
          selection={selection}
          selectedFilter={selectedFilter}
          onAutoOpenProductMissing={handleTargetProductMissing}
          onAutoOpenProductModalClose={clearTargetProductId}
        />
      )}
    </ProductEditPageShell>
  );
};
