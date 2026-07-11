'use client';

import { useState } from 'react';

import Link from 'next/link';

import { PointChip } from '@dongchimi/design-system';
import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';

import { CLIENT_ROUTES } from '@/shared/constants';

import type { TodaySpecialProductFixtureTypes } from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';
import { formatPrice } from '../utils/format-price';

const TODAY_SPECIAL_PRODUCTS_LIST_ID = 'today-special-products-list';

interface TodaySpecialProductsSectionProps {
  initialVisibleCount: number;
  marketId: string;
  products: TodaySpecialProductFixtureTypes[];
  totalCount: number;
}

export const TodaySpecialProductsSection = ({
  initialVisibleCount,
  marketId,
  products,
  totalCount,
}: TodaySpecialProductsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleProducts = isExpanded ? products : products.slice(0, initialVisibleCount);
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

      <div className={S.todayProductListClassName} id={TODAY_SPECIAL_PRODUCTS_LIST_ID}>
        {visibleProducts.map((product) => (
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
            <PointChip className={S.discountChipClassName} size='mobile'>
              {product.discountRate}%
            </PointChip>
          </Link>
        ))}
      </div>

      <button
        aria-controls={TODAY_SPECIAL_PRODUCTS_LIST_ID}
        aria-expanded={isExpanded}
        className={S.inlineToggleButtonClassName}
        onClick={() => setIsExpanded((previousValue) => !previousValue)}
        type='button'
      >
        {toggleLabel}
        <ToggleIcon aria-hidden='true' />
      </button>
    </section>
  );
};
