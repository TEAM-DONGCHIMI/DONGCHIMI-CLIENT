import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { todaySpecialEditProducts } from './fixtures';
import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  const { deleteProduct, products, resetProducts } =
    useProductEditProducts(todaySpecialEditProducts);

  return (
    <ProductEditPageShell activeType='todaySpecial' onResetProducts={resetProducts}>
      {(selectedFilter) => (
        <TodaySpecialEditProductSection
          products={products}
          selectedFilter={selectedFilter}
          onDeleteProduct={deleteProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
