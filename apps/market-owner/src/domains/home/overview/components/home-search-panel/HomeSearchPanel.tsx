import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { ProductSearchPanel } from '@/shared/components';
import { useDebouncedValue } from '@/shared/hooks';

import { getHomeSearchProductsByQuery, homeSearchProducts } from '../../fixtures';

interface HomeSearchPanelProps {
  onProductLoadError: () => void;
}

const getSearchProductById = (productId: string) => {
  return homeSearchProducts.find((product) => product.id === productId);
};

export const HomeSearchPanel = ({ onProductLoadError }: HomeSearchPanelProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const isSearchPending = query.trim().length > 0 && query !== debouncedQuery;
  const searchProducts = useMemo(
    () => getHomeSearchProductsByQuery(debouncedQuery),
    [debouncedQuery],
  );

  return (
    <ProductSearchPanel
      isPending={isSearchPending}
      items={searchProducts}
      onQueryChange={(nextQuery) => setQuery(nextQuery)}
      onSelectProduct={(item) => {
        const selectedProduct = getSearchProductById(item.id);

        if (!selectedProduct || selectedProduct.isProductInfoLoadable === false) {
          onProductLoadError();

          return;
        }

        navigate(selectedProduct.editRoute, { state: { productId: selectedProduct.id } });
      }}
    />
  );
};
