import { useNavigate } from 'react-router';

import { ProductSearchPanel } from '@/shared/components';

import { homeSearchProducts } from '../../fixtures';

interface HomeSearchPanelProps {
  onProductLoadError: () => void;
}

const getSearchProductById = (productId: string) => {
  return homeSearchProducts.find((product) => product.id === productId);
};

export const HomeSearchPanel = ({ onProductLoadError }: HomeSearchPanelProps) => {
  const navigate = useNavigate();

  return (
    <ProductSearchPanel
      items={homeSearchProducts}
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
