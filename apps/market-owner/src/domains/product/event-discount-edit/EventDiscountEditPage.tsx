import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts, useProductEditTargetParam } from '@/domains/product/hooks';

import { todaySpecialEditProducts } from '../today-special-edit/fixtures';
import { eventDiscountEditProducts } from './fixtures';
import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

export const EventDiscountEditPage = () => {
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
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
          autoOpenProductId={targetProductId}
          products={products}
          selection={selection}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onAutoOpenProductMissing={handleTargetProductMissing}
          onAutoOpenProductModalClose={clearTargetProductId}
          onDeleteProduct={deleteProduct}
          onUpdateProduct={updateProduct}
        />
      )}
    </ProductEditPageShell>
  );
};
