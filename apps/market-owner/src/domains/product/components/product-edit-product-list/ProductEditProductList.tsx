import { ProductEditCardDesktop } from '@/shared/components';

import * as S from './ProductEditProductList.css';
import { openProductEditConfirmModal, openProductEditModal } from '../product-edit-modal';
import {
  type ProductEditCardProps,
  type ProductEditCardVariantTypes,
  type ProductEditProductGroup,
} from './display-groups';
import { ProductEditEmptyView } from './product-edit-empty-view';
import { isProductEditDateTodayOrFuture } from '../../utils/product-edit-date';

interface ProductEditProductListProps {
  ariaLabel: string;
  editModalVariant: ProductEditCardVariantTypes;
  groups: ProductEditProductGroup[];
  registrationHref: string;
  selectedProductNames?: string[];
  selectionMode?: boolean;
  onDeleteProduct?: (product: ProductEditCardProps) => void;
  onToggleProductSelection?: (product: ProductEditCardProps) => void;
}

const hasProducts = (groups: ProductEditProductGroup[]) =>
  groups.some(({ products }) => products.length > 0);

const hasRemainingPromotionPeriod = (product: ProductEditCardProps) => {
  return isProductEditDateTodayOrFuture(product.endDate);
};

export const ProductEditProductList = ({
  ariaLabel,
  editModalVariant,
  groups,
  selectedProductNames = [],
  selectionMode = false,
  registrationHref,
  onDeleteProduct,
  onToggleProductSelection,
}: ProductEditProductListProps) => {
  if (!hasProducts(groups)) {
    return <ProductEditEmptyView ariaLabel={ariaLabel} registrationHref={registrationHref} />;
  }

  const deleteProduct = (product: ProductEditCardProps) => {
    if (hasRemainingPromotionPeriod(product)) {
      openProductEditConfirmModal({
        action: 'delete',
        onConfirm: () => onDeleteProduct?.(product),
      });

      return;
    }

    onDeleteProduct?.(product);
  };
  const selectedProductNameSet = new Set(selectedProductNames);

  return (
    <section aria-label={ariaLabel} className={S.sectionListClassName}>
      {groups.map(({ products, title }) => (
        <section key={title} className={S.categorySectionClassName}>
          <h2 className={S.categoryTitleClassName}>{title}</h2>

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
                  onEditClick={
                    selectionMode
                      ? undefined
                      : () => openProductEditModal({ product, variant: editModalVariant })
                  }
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
