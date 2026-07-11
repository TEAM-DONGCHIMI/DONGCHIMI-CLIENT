import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { eventDiscountEditProducts } from '../event-discount-edit/fixtures/event-discount-edit.fixture';
import { todaySpecialEditProducts } from './fixtures/today-special-edit.fixture';
import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  const {
    deleteProduct,
    deleteProducts,
    products,
    resetProducts,
    updateProduct,
    updateProductPeriods,
  } = useProductEditProducts(todaySpecialEditProducts);

  return (
    <ProductEditPageShell
      activeType='todaySpecial'
      periodBaseProduct={products[0]}
      productCounts={{
        eventDiscount: eventDiscountEditProducts.length,
        todaySpecial: products.length,
      }}
      onDeleteProducts={deleteProducts}
      onResetProducts={resetProducts}
      onUpdateProductPeriods={updateProductPeriods}
    >
      {(selectedFilter, _selectedCategory, selection) => (
        <TodaySpecialEditProductSection
          products={products}
          selection={selection}
          selectedFilter={selectedFilter}
          onDeleteProduct={deleteProduct}
          onUpdateProduct={updateProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
