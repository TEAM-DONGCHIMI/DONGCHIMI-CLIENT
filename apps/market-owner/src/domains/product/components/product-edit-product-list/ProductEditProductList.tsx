import { ProductEditCardDesktop } from '@/shared/components';
import { formatProductCategoryDisplayName } from '@/shared/utils/product-category.utils';

import * as S from './ProductEditProductList.css';
import { type ProductEditCardProps, type ProductEditProductGroup } from './display-groups';
import { ProductEditEmptyView } from './product-edit-empty-view';
import { useProductListIntersectionObserver } from './use-product-list-intersection-observer';

export interface ProductEditListActions {
  disabled?: boolean;
  onDeleteProduct?: (product: ProductEditCardProps) => void;
  onEditProduct?: (product: ProductEditCardProps) => void;
}

export interface ProductEditListPagination {
  hasNextPage: boolean;
  status: 'error' | 'idle' | 'loading';
  onLoadNextPage: () => void;
}

export interface ProductEditListSelection {
  enabled: boolean;
  selectedProductIds: readonly (number | string)[];
  onToggleProduct: (product: ProductEditCardProps) => void;
}

interface ProductEditProductListProps {
  actions: ProductEditListActions;
  ariaLabel: string;
  groups: ProductEditProductGroup[];
  pagination?: ProductEditListPagination;
  registrationHref: string;
  selection?: ProductEditListSelection;
}

const hasProducts = (groups: ProductEditProductGroup[]) =>
  groups.some(({ products }) => products.length > 0);

export const ProductEditProductList = ({
  actions,
  ariaLabel,
  groups,
  pagination,
  registrationHref,
  selection,
}: ProductEditProductListProps) => {
  const { disabled: actionsDisabled = false, onDeleteProduct, onEditProduct } = actions;
  const {
    hasNextPage = false,
    status: paginationStatus = 'idle',
    onLoadNextPage,
  } = pagination ?? {};
  const {
    enabled: selectionMode = false,
    selectedProductIds = [],
    onToggleProduct,
  } = selection ?? {};
  const isFetchNextPageError = paginationStatus === 'error';
  const isFetchingNextPage = paginationStatus === 'loading';
  const loadMoreSentinelRef = useProductListIntersectionObserver<HTMLDivElement>({
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    onIntersect: onLoadNextPage,
  });

  if (!hasProducts(groups)) {
    return <ProductEditEmptyView ariaLabel={ariaLabel} registrationHref={registrationHref} />;
  }

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
                  actionsDisabled={selectionMode || actionsDisabled}
                  aria-label={product['aria-label'] ?? `${product.productName} 상품 수정 카드`}
                  selectionState={
                    selectionMode ? (isSelected ? 'selected' : 'selectable') : 'default'
                  }
                  onDeleteClick={
                    selectionMode || actionsDisabled ? undefined : () => onDeleteProduct?.(product)
                  }
                  onEditClick={selectionMode ? undefined : () => onEditProduct?.(product)}
                  onSelectClick={selectionMode ? () => onToggleProduct?.(product) : undefined}
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
          상품을 더 불러오는 중입니다.
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
