import { ProductEditCardDesktop } from '@/shared/components';

import * as S from './ProductEditProductList.css';
import { type ProductEditProductGroup } from './display-groups';
import { ProductEditEmptyView } from './product-edit-empty-view';

interface ProductEditProductListProps {
  ariaLabel: string;
  groups: ProductEditProductGroup[];
  registrationHref: string;
}

const hasProducts = (groups: ProductEditProductGroup[]) =>
  groups.some(({ products }) => products.length > 0);

export const ProductEditProductList = ({
  ariaLabel,
  groups,
  registrationHref,
}: ProductEditProductListProps) => {
  if (!hasProducts(groups)) {
    return <ProductEditEmptyView ariaLabel={ariaLabel} registrationHref={registrationHref} />;
  }

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
              />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};
