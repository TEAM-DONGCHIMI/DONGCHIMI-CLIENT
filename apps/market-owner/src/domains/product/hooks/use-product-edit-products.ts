import { useState } from 'react';

interface ProductEditMutableProduct {
  categoryName?: string;
  endDate?: string;
  originalPrice?: string;
  productId: number;
  productName: string;
  promotionText?: string;
  salePrice?: string;
  startDate?: string;
}

interface ProductEditPeriodUpdate {
  endDate: string;
  startDate: string;
}

type ProductEditUpdateTypes = Omit<ProductEditMutableProduct, 'productId'>;

export const useProductEditProducts = <ProductTypes extends ProductEditMutableProduct>(
  initialProducts: readonly ProductTypes[],
  onDeleteProduct: (productId: number) => Promise<boolean>,
) => {
  const [products, setProducts] = useState<ProductTypes[]>(() => [...initialProducts]);

  const deleteProduct = async (productId: number) => {
    const isDeleted = await onDeleteProduct(productId);

    if (!isDeleted) {
      return false;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.productId !== productId),
    );

    return true;
  };

  const updateProduct = (productName: string, productUpdate: Partial<ProductEditUpdateTypes>) => {
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
    products,
    updateProduct,
    updateProductPeriods,
  };
};
