import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts, useProductEditTargetParam } from '@/domains/product/hooks';

import { eventDiscountEditProducts } from '../event-discount-edit/fixtures';
import { todaySpecialEditProducts } from './fixtures';
import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

export const TodaySpecialEditPage = () => {
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
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
          autoOpenProductId={targetProductId}
          products={products}
          selection={selection}
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
