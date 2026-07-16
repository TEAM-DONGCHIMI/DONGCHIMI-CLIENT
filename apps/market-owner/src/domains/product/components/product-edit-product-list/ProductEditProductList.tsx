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
import { useProductListIntersectionObserver } from './use-product-list-intersection-observer';

interface ProductEditProductListProps {
  deletePending?: boolean;
  ariaLabel: string;
  editModalVariant: ProductEditCardVariantTypes;
  autoOpenProductId?: string | null;
  groups: ProductEditProductGroup[];
  hasNextPage?: boolean;
  isFetchNextPageError?: boolean;
  isFetchingNextPage?: boolean;
  marketId: number;
  registrationHref: string;
  selectedProductIds?: (number | string)[];
  selectionMode?: boolean;
  onDeleteProduct?: (product: ProductEditCardProps) => void;
  onLoadNextPage?: () => void;
  onAutoOpenProductMissing?: (productId: string) => void;
  onAutoOpenProductModalClose?: () => void;
  onToggleProductSelection?: (product: ProductEditCardProps) => void;
  onUpdateProduct?: (productId: number, product: ProductEditCardProps) => void;
}

const hasProducts = (groups: ProductEditProductGroup[]) =>
  groups.some(({ products }) => products.length > 0);

const parseProductId = (value: ProductEditCardProps['productId']) => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  const productId = Number(value);

  return Number.isSafeInteger(productId) && productId > 0 ? productId : null;
};

export const ProductEditProductList = ({
  ariaLabel,
  deletePending = false,
  editModalVariant,
  autoOpenProductId,
  groups,
  hasNextPage = false,
  isFetchNextPageError = false,
  isFetchingNextPage = false,
  marketId,
  selectedProductIds = [],
  selectionMode = false,
  registrationHref,
  onAutoOpenProductMissing,
  onAutoOpenProductModalClose,
  onDeleteProduct,
  onLoadNextPage,
  onToggleProductSelection,
  onUpdateProduct,
}: ProductEditProductListProps) => {
  const openedProductIdRef = useRef<string | null>(null);
  const loadMoreSentinelRef = useProductListIntersectionObserver<HTMLDivElement>({
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    onIntersect: onLoadNextPage,
  });

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

    const targetProductId = parseProductId(targetProduct.productId);

    if (targetProductId == null) {
      onAutoOpenProductMissing?.(autoOpenProductId);

      return;
    }

    openProductEditModal({
      marketId,
      product: targetProduct,
      productId: targetProductId,
      variant: editModalVariant,
      onClose: onAutoOpenProductModalClose,
      onSubmit: (updatedProduct) => onUpdateProduct?.(targetProductId, updatedProduct),
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
    const productId = parseProductId(product.productId);

    if (productId == null) {
      return;
    }

    openProductEditModal({
      marketId,
      product,
      productId,
      variant: editModalVariant,
      onSubmit: (updatedProduct) => onUpdateProduct?.(productId, updatedProduct),
    });
  };
  const selectedProductIdSet = new Set(selectedProductIds.map(String));

  return (
    <section aria-label={ariaLabel} className={S.sectionListClassName}>
      {groups.map(({ products, title }) => (
        <section key={title} className={S.categorySectionClassName}>
          <h2 className={S.categoryTitleClassName}>{formatProductCategoryDisplayName(title)}</h2>

          <div className={S.productGridClassName}>
            {products.map((product) => {
              const isSelected =
                product.productId != null && selectedProductIdSet.has(String(product.productId));

              return (
                <ProductEditCardDesktop
                  key={product.productId ?? `${title}-${product.productName}`}
                  {...product}
                  actionsDisabled={selectionMode || deletePending}
                  aria-label={product['aria-label'] ?? `${product.productName} 상품 수정 카드`}
                  selectionState={
                    selectionMode ? (isSelected ? 'selected' : 'selectable') : 'default'
                  }
                  onDeleteClick={
                    selectionMode || deletePending ? undefined : () => deleteProduct(product)
                  }
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

      {hasNextPage && !isFetchNextPageError && (
        <div ref={loadMoreSentinelRef} aria-hidden='true' className={S.loadMoreSentinelClassName} />
      )}
      {isFetchingNextPage && (
        <p className={S.loadingClassName} role='status'>
          상품을 더 불러오는 중이에요.
        </p>
      )}
      {isFetchNextPageError && (
        <div className={S.loadMoreErrorClassName} role='alert'>
          <p className={S.loadMoreErrorMessageClassName}>상품을 더 불러오지 못했어요.</p>
          <button className={S.retryButtonClassName} onClick={onLoadNextPage} type='button'>
            다시 시도
          </button>
        </div>
      )}
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
