import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';

import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  return (
    <ProductEditPageShell activeType='eventDiscount'>
      {(selectedFilter, selectedCategory) => (
        <EventDiscountEditProductSection
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
        />
      )}
    </ProductEditPageShell>
  );
};
