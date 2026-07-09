import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';

import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  return (
    <ProductEditPageShell activeType='todaySpecial'>
      {(selectedFilter, selectedCategory) => (
        <TodaySpecialEditProductSection
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
        />
      )}
    </ProductEditPageShell>
  );
};
