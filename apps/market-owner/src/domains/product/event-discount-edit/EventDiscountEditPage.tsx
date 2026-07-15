import { Navigate } from 'react-router';

import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductDeletionActions, useProductEditTargetParam } from '@/domains/product/hooks';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

import { EventDiscountEditProductSection } from './sections/EventDiscountEditProductSection';

interface EventDiscountEditPageContentProps {
  marketId: number;
}

const EventDiscountEditPageContent = ({ marketId }: EventDiscountEditPageContentProps) => {
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
  const { deleteProduct, deleteProducts, isDeletePending, resetProducts } =
    useProductDeletionActions(marketId);

  return (
    <ProductEditPageShell
      activeType='eventDiscount'
      deletePending={isDeletePending}
      onDeleteProducts={deleteProducts}
      onResetProducts={() => resetProducts('PERIODIC')}
    >
      {(selectedFilter, selectedCategory, selection) => (
        <EventDiscountEditProductSection
          autoOpenProductId={targetProductId}
          deletePending={isDeletePending}
          marketId={marketId}
          selection={selection}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          onAutoOpenProductMissing={handleTargetProductMissing}
          onAutoOpenProductModalClose={clearTargetProductId}
          onDeleteProduct={deleteProduct}
        />
      )}
    </ProductEditPageShell>
  );
};

export const EventDiscountEditPage = () => {
  const marketId = useAuthStore((state) => state.marketId);

  if (marketId == null) {
    return <Navigate replace to={MARKET_OWNER_ROUTES.marketInformationRegistration} />;
  }

  return <EventDiscountEditPageContent marketId={marketId} />;
};
