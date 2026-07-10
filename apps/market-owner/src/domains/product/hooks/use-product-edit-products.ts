import { useState } from 'react';

interface ProductEditMutableProduct {
  categoryName?: string;
  endDate?: string;
  originalPrice?: string;
  productName: string;
  salePrice?: string;
  startDate?: string;
}

interface ProductEditPeriodUpdate {
  endDate: string;
  startDate: string;
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

  const updateProduct = (
    productName: string,
    productUpdate: Partial<ProductEditMutableProduct>,
  ) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.productName === productName
          ? ({
              ...product,
              ...productUpdate,
            } as ProductTypes)
          : product,
      ),
    );
  };

  const updateProductPeriods = (productNames: string[], period: ProductEditPeriodUpdate) => {
    const productNameSet = new Set(productNames);

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        productNameSet.has(product.productName)
          ? ({
              ...product,
              ...period,
            } as ProductTypes)
          : product,
      ),
    );
  };

  return {
    deleteProduct,
    deleteProducts,
    products,
    resetProducts,
    updateProduct,
    updateProductPeriods,
  };
};
