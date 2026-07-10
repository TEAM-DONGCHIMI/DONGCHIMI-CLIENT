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

  const deleteProducts = (productNames: string[]) => {
    const productNameSet = new Set(productNames);

    setProducts((currentProducts) =>
      currentProducts.filter((product) => !productNameSet.has(product.productName)),
    );
  };

  const resetProducts = () => {
    setProducts([]);
  };

  return {
    deleteProduct,
    deleteProducts,
    products,
    resetProducts,
  };
};
