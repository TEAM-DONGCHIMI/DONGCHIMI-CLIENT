import { useState } from 'react';

import { useProductDeletionActions } from './use-product-deletion-actions';

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
  marketId: number,
) => {
  const [products, setProducts] = useState<ProductTypes[]>(() => [...initialProducts]);
  const deletionActions = useProductDeletionActions(marketId);

  const deleteProduct = async (productId: number) => {
    const isDeleted = await deletionActions.deleteProduct(productId);

    if (!isDeleted) {
      return false;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.productId !== productId),
    );

    return true;
  };

  const deleteProducts = async (productIds: number[]) => {
    const isDeleted = await deletionActions.deleteProducts(productIds);

    if (!isDeleted) {
      return false;
    }

    const productIdSet = new Set(productIds);

    setProducts((currentProducts) =>
      currentProducts.filter((product) => !productIdSet.has(product.productId)),
    );

    return true;
  };

  const resetProducts = () => {
    setProducts([]);
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
    deleteProducts,
    isDeletePending: deletionActions.isDeletePending,
    products,
    resetProducts,
    updateProduct,
    updateProductPeriods,
  };
};
