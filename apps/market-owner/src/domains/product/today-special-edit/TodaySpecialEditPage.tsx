import { Navigate } from 'react-router';

import { ProductEditPageShell } from '@/domains/product/components/product-edit-page-shell';
import { useProductDeletionActions, useProductEditTargetParam } from '@/domains/product/hooks';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

import { TodaySpecialEditProductSection } from './sections/TodaySpecialEditProductSection';

interface TodaySpecialEditPageContentProps {
  marketId: number;
}

const TodaySpecialEditPageContent = ({ marketId }: TodaySpecialEditPageContentProps) => {
  const { clearTargetProductId, handleTargetProductMissing, targetProductId } =
    useProductEditTargetParam();
  const { deleteProduct, deleteProducts, isDeletePending, resetProducts } =
    useProductDeletionActions(marketId);

  return (
    <ProductEditPageShell
      activeType='todaySpecial'
      deletePending={isDeletePending}
      onDeleteProducts={deleteProducts}
      onResetProducts={() => resetProducts('DAILY')}
    >
      {(selectedFilter, _selectedCategory, selection) => (
        <TodaySpecialEditProductSection
          autoOpenProductId={targetProductId}
          deletePending={isDeletePending}
          marketId={marketId}
          selection={selection}
          selectedFilter={selectedFilter}
          onAutoOpenProductMissing={handleTargetProductMissing}
          onAutoOpenProductModalClose={clearTargetProductId}
          onDeleteProduct={deleteProduct}
        />
      )}
    </ProductEditPageShell>
  );
};

export const TodaySpecialEditPage = () => {
  const marketId = useAuthStore((state) => state.marketId);

  if (marketId == null) {
    return <Navigate replace to={MARKET_OWNER_ROUTES.marketInformationRegistration} />;
  }

  return <TodaySpecialEditPageContent marketId={marketId} />;
};
