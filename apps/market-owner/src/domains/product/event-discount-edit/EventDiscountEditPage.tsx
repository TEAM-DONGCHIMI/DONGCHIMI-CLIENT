import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditTargetParam } from '@/domains/product/hooks';

import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
  return (
    <ProductEditPageShell activeType='eventDiscount'>
      {(selectedFilter, selectedCategory, selection) => (
        <EventDiscountEditProductSection
          autoOpenProductId={targetProductId}
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
