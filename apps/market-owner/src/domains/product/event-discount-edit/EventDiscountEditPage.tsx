import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { todaySpecialEditProducts } from '../today-special-edit/fixtures/today-special-edit.fixture';
import { eventDiscountEditProducts } from './fixtures/event-discount-edit.fixture';
import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  const {
    deleteProduct,
    deleteProducts,
    products,
    resetProducts,
    updateProduct,
    updateProductPeriods,
  } = useProductEditProducts(eventDiscountEditProducts);

  return (
    <ProductEditPageShell
      activeType='eventDiscount'
      periodBaseProduct={products[0]}
      productCounts={{
        eventDiscount: products.length,
        todaySpecial: todaySpecialEditProducts.length,
      }}
      onDeleteProducts={deleteProducts}
      onResetProducts={resetProducts}
      onUpdateProductPeriods={updateProductPeriods}
    >
      {(selectedFilter, selectedCategory, selection) => (
        <EventDiscountEditProductSection
          products={products}
          selection={selection}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onDeleteProduct={deleteProduct}
          onUpdateProduct={updateProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
