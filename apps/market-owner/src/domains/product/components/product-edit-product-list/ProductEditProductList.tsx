import { type ComponentProps } from 'react';

import { ProductEditCardDesktop } from '@/shared/components';

import * as S from './ProductEditProductList.css';

type ProductEditCardProps = ComponentProps<typeof ProductEditCardDesktop>;

export interface ProductEditProductGroup {
  products: ProductEditCardProps[];
  title: string;
}

interface ProductEditProductListProps {
  ariaLabel: string;
  groups: ProductEditProductGroup[];
}

export const ProductEditProductList = ({ ariaLabel, groups }: ProductEditProductListProps) => {
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
                aria-label={`${product.productName} 상품 수정 카드`}
              />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};
