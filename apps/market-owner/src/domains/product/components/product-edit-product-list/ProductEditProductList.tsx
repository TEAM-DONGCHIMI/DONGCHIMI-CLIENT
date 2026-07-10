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
  onDeleteProduct?: (product: ProductEditCardProps) => void;
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
  registrationHref,
  onDeleteProduct,
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

  return (
    <section aria-label={ariaLabel} className={S.sectionListClassName}>
      {groups.map(({ products, title }) => (
        <section key={title} className={S.categorySectionClassName}>
          <h2 className={S.categoryTitleClassName}>{title}</h2>

          <div className={S.productGridClassName}>
            {products.map((product) => (
              <ProductEditCardDesktop
                key={`${title}-${product.productName}`}
                {...product}
                aria-label={product['aria-label'] ?? `${product.productName} 상품 수정 카드`}
                onDeleteClick={() => deleteProduct(product)}
                onEditClick={() => openProductEditModal({ product, variant: editModalVariant })}
              />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};
