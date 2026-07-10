import { useState } from 'react';

interface ProductEditMutableProduct {
  productName: string;
}

export const useProductEditProducts = <ProductTypes extends ProductEditMutableProduct>(
  initialProducts: readonly ProductTypes[],
) => {
  const [products, setProducts] = useState<ProductTypes[]>(() => [...initialProducts]);

  const deleteProduct = (productName: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.productName !== productName),
    );
  };

  const resetProducts = () => {
    setProducts([]);
  };

  return {
    deleteProduct,
    products,
    resetProducts,
  };
};
