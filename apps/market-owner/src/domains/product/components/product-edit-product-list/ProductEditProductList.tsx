import { useEffect, useRef } from 'react';

import { ProductEditCardDesktop } from '@/shared/components';
import { formatProductCategoryDisplayName } from '@/shared/utils/product-category.utils';

import * as S from './ProductEditProductList.css';
import { openProductEditConfirmModal, openProductEditModal } from '../product-edit-modal';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
  type ProductEditProductGroup,
} from './display-groups';
import { ProductEditEmptyView } from './product-edit-empty-view';

interface ProductEditProductListProps {
  ariaLabel: string;
  editModalVariant: ProductEditCardVariantTypes;
  autoOpenProductId?: string | null;
  groups: ProductEditProductGroup[];
  marketId: number;
  registrationHref: string;
  selectedProductNames?: string[];
  selectionMode?: boolean;
  onDeleteProduct?: (product: ProductEditCardProps) => void;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
  onToggleProductSelection?: (product: ProductEditCardProps) => void;
  onUpdateProduct?: (productName: string, product: ProductEditCardProps) => void;
}

const hasProducts = (groups: ProductEditProductGroup[]) =>
  groups.some(({ products }) => products.length > 0);

export const ProductEditProductList = ({
  ariaLabel,
  editModalVariant,
  autoOpenProductId,
  groups,
  marketId,
  selectedProductNames = [],
  selectionMode = false,
  registrationHref,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
  onToggleProductSelection,
  onUpdateProduct,
}: ProductEditProductListProps) => {
  const openedProductIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (autoOpenProductId == null) {
      openedProductIdRef.current = null;

      return;
    }

    if (selectionMode || openedProductIdRef.current === autoOpenProductId) {
      return;
    }

    const targetProduct = groups
      .flatMap((group) => group.products)
      .find((product) => String(product.productId) === autoOpenProductId);

    openedProductIdRef.current = autoOpenProductId;

    if (targetProduct == null) {
      onAutoOpenProductMissing?.(autoOpenProductId);

      return;
    }

    openProductEditModal({
      marketId,
      product: targetProduct,
      productId: Number(targetProduct.productId),
      variant: editModalVariant,
      onClose: onAutoOpenProductModalClose,
      onSubmit: (updatedProduct) => onUpdateProduct?.(targetProduct.productName, updatedProduct),
    });
  }, [
    autoOpenProductId,
    editModalVariant,
    groups,
    marketId,
    onAutoOpenProductMissing,
    onAutoOpenProductModalClose,
    onUpdateProduct,
    selectionMode,
  ]);

  if (!hasProducts(groups)) {
    return <ProductEditEmptyView ariaLabel={ariaLabel} registrationHref={registrationHref} />;
  }

  const deleteProduct = (product: ProductEditCardProps) => {
    openProductEditConfirmModal({
      action: 'delete',
      onConfirm: () => onDeleteProduct?.(product),
    });
  };
  const editProduct = (product: ProductEditCardProps) => {
    if (product.productId == null) {
      return;
    }

    openProductEditModal({
      marketId,
      product,
      productId: Number(product.productId),
      variant: editModalVariant,
      onSubmit: (updatedProduct) => onUpdateProduct?.(product.productName, updatedProduct),
    });
  };
  const selectedProductNameSet = new Set(selectedProductNames);

  return (
    <section aria-label={ariaLabel} className={S.sectionListClassName}>
      {groups.map(({ products, title }) => (
        <section key={title} className={S.categorySectionClassName}>
          <h2 className={S.categoryTitleClassName}>{formatProductCategoryDisplayName(title)}</h2>

          <div className={S.productGridClassName}>
            {products.map((product) => {
              const isSelected = selectedProductNameSet.has(product.productName);

              return (
                <ProductEditCardDesktop
                  key={`${title}-${product.productName}`}
                  {...product}
                  actionsDisabled={selectionMode}
                  aria-label={product['aria-label'] ?? `${product.productName} 상품 수정 카드`}
                  selectionState={
                    selectionMode ? (isSelected ? 'selected' : 'selectable') : 'default'
                  }
                  onDeleteClick={selectionMode ? undefined : () => deleteProduct(product)}
                  onEditClick={selectionMode ? undefined : () => editProduct(product)}
                  onSelectClick={
                    selectionMode ? () => onToggleProductSelection?.(product) : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
};

export const ProductEditProductListLoading = () => {
  return (
    <p aria-live='polite' className={S.loadingClassName} role='status'>
      상품 목록을 불러오는 중이에요.
    </p>
  );
};
