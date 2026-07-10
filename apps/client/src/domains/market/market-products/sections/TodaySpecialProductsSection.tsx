import Link from 'next/link';

import { PointChip } from '@dongchimi/design-system';
import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';

import { CLIENT_ROUTES } from '@/shared/constants';

import type { TodaySpecialProductFixtureTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';

interface TodaySpecialProductsSectionProps {
  isExpanded: boolean;
  marketId: string;
  onToggleExpanded: () => void;
  products: TodaySpecialProductFixtureTypes[];
  totalCount: number;
}

const formatPrice = (price: number) => price.toLocaleString('ko-KR');

export const TodaySpecialProductsSection = ({
  isExpanded,
  marketId,
  onToggleExpanded,
  products,
  totalCount,
}: TodaySpecialProductsSectionProps) => {
  const toggleLabel = isExpanded ? '접기' : '등록한 상품 전체보기';
  const ToggleIcon = isExpanded ? IcChevronUp : IcChevronDown;

  return (
    <section aria-labelledby='today-special-products-title' className={S.todaySpecialCardClassName}>
      <div className={S.sectionHeaderClassName}>
        <h2 className={S.sectionTitleClassName} id='today-special-products-title'>
          오늘의 특가 상품
        </h2>
        <span className={S.sectionCountClassName}>{totalCount}건</span>
      </div>

      <div className={S.todayProductListClassName}>
        {products.map((product) => (
          <Link
            key={product.productId}
            aria-label={`${product.name} ${formatPrice(product.discountedPrice)}원 상품 보기`}
            className={S.todayProductLinkClassName}
            href={CLIENT_ROUTES.marketProduct(marketId, String(product.productId))}
          >
            <span className={S.todayProductImageClassName}>
              <span aria-hidden='true' className={S.imageFallbackClassName} />
            </span>
            <span className={S.todayProductContentClassName}>
              <span className={S.todayProductNameClassName}>{product.name}</span>
              <span className={S.todayProductPriceRowClassName}>
                <strong className={S.todayProductDiscountedPriceClassName}>
                  {formatPrice(product.discountedPrice)}원
                </strong>
                <span className={S.todayProductOriginalPriceClassName}>
                  {formatPrice(product.originalPrice)}원
                </span>
              </span>
            </span>
            <PointChip className={S.discountChipClassName} rounded={false} size='mobile'>
              {product.discountRate}%
            </PointChip>
          </Link>
        ))}
      </div>

      <button
        aria-controls='today-special-products-title'
        aria-expanded={isExpanded}
        className={S.inlineToggleButtonClassName}
        onClick={onToggleExpanded}
        type='button'
      >
        {toggleLabel}
        <ToggleIcon aria-hidden='true' />
      </button>
    </section>
  );
};
