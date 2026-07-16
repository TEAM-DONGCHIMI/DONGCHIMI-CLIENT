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
  const [deletedProductIds, setDeletedProductIds] = useState<Set<number>>(() => new Set());
  const [productUpdates, setProductUpdates] = useState<
    Map<number, Partial<ProductEditUpdateTypes>>
  >(() => new Map());
  const products = initialProducts.flatMap((product) => {
    if (deletedProductIds.has(product.productId)) {
      return [];
    }

    return [
      {
        ...product,
        ...productUpdates.get(product.productId),
      } as ProductTypes,
    ];
  });

  const deleteProduct = async (productId: number) => {
    const isDeleted = await onDeleteProduct(productId);

    if (!isDeleted) {
      return false;
    }

    setDeletedProductIds((currentProductIds) => new Set(currentProductIds).add(productId));

    return true;
  };

  const updateProduct = (productId: number, productUpdate: Partial<ProductEditUpdateTypes>) => {
    const targetProduct = products.find((product) => product.productId === productId);

    if (targetProduct == null) {
      return;
    }

    setProductUpdates((currentUpdates) => {
      const nextUpdates = new Map(currentUpdates);
      const currentProductUpdate = nextUpdates.get(targetProduct.productId);

      nextUpdates.set(targetProduct.productId, {
        ...currentProductUpdate,
        ...productUpdate,
      });

      return nextUpdates;
    });
  };

  const updateProductPeriods = (productNames: string[], period: ProductEditPeriodUpdate) => {
    const productNameSet = new Set(productNames);

    setProductUpdates((currentUpdates) => {
      const nextUpdates = new Map(currentUpdates);

      products.forEach((product) => {
        if (!productNameSet.has(product.productName)) {
          return;
        }

        nextUpdates.set(product.productId, {
          ...nextUpdates.get(product.productId),
          ...period,
        });
      });

      return nextUpdates;
    });
  };

  return {
    deleteProduct,
    products,
    updateProduct,
    updateProductPeriods,
  };
};
