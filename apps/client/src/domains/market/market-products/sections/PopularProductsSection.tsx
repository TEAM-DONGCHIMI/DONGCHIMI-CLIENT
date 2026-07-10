import Link from 'next/link';

import { PointChip } from '@dongchimi/design-system';

import { CLIENT_ROUTES } from '@/shared/constants';

import type { TopProductFixtureTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';
import { formatPrice } from '../utils/format-price';

interface PopularProductsSectionProps {
  marketId: string;
  products: TopProductFixtureTypes[];
}

export const PopularProductsSection = ({ marketId, products }: PopularProductsSectionProps) => {
  return (
    <section aria-labelledby='popular-products-title' className={S.sectionClassName}>
      <h2 className={S.sectionTitleClassName} id='popular-products-title'>
        지금 가장 인기 있는 상품 TOP 3
      </h2>

      <div className={S.popularListClassName}>
        {products.map((product) => (
          <Link
            key={product.productId}
            aria-label={`${product.name} ${formatPrice(product.discountedPrice)}원 상품 보기`}
            className={S.topProductLinkClassName}
            href={CLIENT_ROUTES.marketProduct(marketId, String(product.productId))}
          >
            <article className={S.topProductCardClassName}>
              <span aria-hidden='true' className={S.topProductImageFallbackClassName} />
              <span aria-hidden='true' className={S.topProductScrimClassName} />
              <PointChip className={S.discountChipClassName} size='mobile'>
                {product.discountRate}%
              </PointChip>
              <span className={S.topProductContentClassName}>
                <span className={S.topProductNameClassName}>{product.name}</span>
                <strong className={S.topProductPriceClassName}>
                  {formatPrice(product.discountedPrice)}원
                </strong>
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};
