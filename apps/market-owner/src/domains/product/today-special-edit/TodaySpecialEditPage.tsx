import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { todaySpecialEditProducts } from './fixtures';
import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  const { deleteProduct, deleteProducts, products, resetProducts } =
    useProductEditProducts(todaySpecialEditProducts);

  return (
    <ProductEditPageShell
      activeType='todaySpecial'
      periodBaseProduct={products[0]}
      onDeleteProducts={deleteProducts}
      onResetProducts={resetProducts}
    >
      {(selectedFilter, _selectedCategory, selection) => (
        <TodaySpecialEditProductSection
          products={products}
          selection={selection}
          selectedFilter={selectedFilter}
          onDeleteProduct={deleteProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
