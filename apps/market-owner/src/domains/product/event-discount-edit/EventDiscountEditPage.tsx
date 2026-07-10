import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { eventDiscountEditProducts } from './fixtures';
import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  const { deleteProduct, deleteProducts, products, resetProducts } =
    useProductEditProducts(eventDiscountEditProducts);

  return (
    <ProductEditPageShell
      activeType='eventDiscount'
      periodBaseProduct={products[0]}
      onDeleteProducts={deleteProducts}
      onResetProducts={resetProducts}
    >
      {(selectedFilter, selectedCategory, selection) => (
        <EventDiscountEditProductSection
          products={products}
          selection={selection}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onDeleteProduct={deleteProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
