import Image from 'next/image';
import Link from 'next/link';

import { CLIENT_ROUTES } from '@/shared/constants';

import { PopularProductDiscountChip } from '../components/PopularProductDiscountChip';
import * as S from '../MarketProductsPage.css';
import type { PopularProductTypes } from '../../model/market-detail-schema';
import { formatPrice } from '../utils/format-price';

interface PopularProductsSectionProps {
  marketSlug: string;
  products: PopularProductTypes[];
}

export const PopularProductsSection = ({ marketSlug, products }: PopularProductsSectionProps) => {
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
            href={CLIENT_ROUTES.marketProduct(marketSlug, String(product.productId))}
          >
            <article className={S.topProductCardClassName}>
              {product.thumbnailUrl != null ? (
                <Image
                  alt=''
                  className={S.topProductImageClassName}
                  fill
                  sizes='calc((100vw - 5.6rem) / 3)'
                  src={product.thumbnailUrl}
                  unoptimized
                />
              ) : (
                <span aria-hidden='true' className={S.topProductImageFallbackClassName} />
              )}
              <span aria-hidden='true' className={S.topProductScrimClassName} />
              <PopularProductDiscountChip discountRate={product.discountRate} />
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
