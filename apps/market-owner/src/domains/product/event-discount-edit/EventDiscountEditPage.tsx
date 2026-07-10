import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { eventDiscountEditProducts } from './fixtures';
import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  const { deleteProduct, products, resetProducts } =
    useProductEditProducts(eventDiscountEditProducts);

  return (
    <ProductEditPageShell
      activeType='eventDiscount'
      periodBaseProduct={products[0]}
      onResetProducts={resetProducts}
    >
      {(selectedFilter, selectedCategory) => (
        <EventDiscountEditProductSection
          products={products}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onDeleteProduct={deleteProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
