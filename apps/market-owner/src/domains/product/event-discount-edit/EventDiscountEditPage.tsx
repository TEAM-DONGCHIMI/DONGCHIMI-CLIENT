import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useToast } from '@dongchimi/shared/toast';

import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductEditProducts } from '@/domains/product/hooks';

import { todaySpecialEditProducts } from '../today-special-edit/fixtures';
import { eventDiscountEditProducts } from './fixtures';
import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

const PRODUCT_EDIT_TARGET_PRODUCT_ID_PARAM = 'productId';
const PRODUCT_EDIT_TARGET_MISSING_MESSAGE = '상품 정보를 불러오지 못했어요.';

export const EventDiscountEditPage = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetProductId = searchParams.get(PRODUCT_EDIT_TARGET_PRODUCT_ID_PARAM);
  const {
    deleteProduct,
    deleteProducts,
    products,
    resetProducts,
    updateProduct,
    updateProductPeriods,
  } = useProductEditProducts(eventDiscountEditProducts);
  const clearTargetProductId = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(PRODUCT_EDIT_TARGET_PRODUCT_ID_PARAM);
    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);
  const handleTargetProductMissing = useCallback(() => {
    toast.error(PRODUCT_EDIT_TARGET_MISSING_MESSAGE);
    clearTargetProductId();
  }, [clearTargetProductId, toast]);

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
