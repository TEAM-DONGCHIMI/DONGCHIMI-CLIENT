'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { PointChip } from '@dongchimi/design-system';
import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';

import { CLIENT_ROUTES } from '@/shared/constants';

import type { DailyProductTypes } from '../../model/daily-products-schema';
import {
  getMarketProductAnchorId,
  isPrimaryProductLinkClick,
  saveMarketProductsScrollRestoration,
  type TodaySpecialScrollRestorationTypes,
} from '../hooks/market-products-scroll-restoration';
import * as S from '../MarketProductsPage.css';
import { formatPrice } from '../utils/format-price';

const TODAY_SPECIAL_PRODUCTS_LIST_ID = 'today-special-products-list';
const DEFAULT_VISIBLE_COUNT = 2;

interface TodaySpecialProductsSectionProps {
  marketSlug: string;
  products: DailyProductTypes[];
  restorationState?: TodaySpecialScrollRestorationTypes;
  totalCount: number;
}

export const TodaySpecialProductsSection = ({
  marketSlug,
  products,
  restorationState,
  totalCount,
}: TodaySpecialProductsSectionProps) => {
  const appliedRestorationIdRef = useRef(restorationState?.restorationId);
  const [isExpanded, setIsExpanded] = useState(restorationState?.isExpanded ?? false);
  const visibleProducts = isExpanded ? products : products.slice(0, DEFAULT_VISIBLE_COUNT);
  const canToggle = products.length > DEFAULT_VISIBLE_COUNT;
  const toggleLabel = isExpanded ? '접기' : '등록한 상품 전체보기';
  const ToggleIcon = isExpanded ? IcChevronUp : IcChevronDown;

  useEffect(() => {
    if (
      restorationState == null ||
      restorationState.restorationId === appliedRestorationIdRef.current
    ) {
      return;
    }

    appliedRestorationIdRef.current = restorationState.restorationId;
    setIsExpanded(restorationState.isExpanded);
  }, [restorationState]);

  return (
    <section aria-labelledby='today-special-products-title' className={S.todaySpecialCardClassName}>
      <div className={S.sectionHeaderClassName}>
        <h2 className={S.sectionTitleClassName} id='today-special-products-title'>
          오늘의 특가 상품
        </h2>
        <span className={S.sectionCountClassName}>{totalCount}건</span>
      </div>

      {products.length === 0 ? (
        <p className={S.todaySpecialEmptyClassName}>등록된 오늘의 특가 상품이 없어요.</p>
      ) : (
        <div className={S.todayProductListClassName} id={TODAY_SPECIAL_PRODUCTS_LIST_ID}>
          {visibleProducts.map((product) => (
            <Link
              key={product.productId}
              aria-label={`${product.name} ${formatPrice(product.discountedPrice)}원 상품 보기`}
              className={S.todayProductLinkClassName}
              href={CLIENT_ROUTES.marketProduct(marketSlug, String(product.productId))}
              id={getMarketProductAnchorId('today-special', product.productId)}
              onClick={(event) => {
                if (!isPrimaryProductLinkClick(event)) {
                  return;
                }

                saveMarketProductsScrollRestoration({
                  anchorId: event.currentTarget.id,
                  isExpanded,
                  marketSlug,
                  productId: String(product.productId),
                  scrollY: window.scrollY,
                  section: 'today-special',
                  viewportTop: event.currentTarget.getBoundingClientRect().top,
                });
              }}
            >
              <span className={S.todayProductImageClassName}>
                {product.thumbnailUrl != null ? (
                  <Image
                    alt=''
                    className={S.todayProductImageElementClassName}
                    fill
                    sizes='5.6rem'
                    src={product.thumbnailUrl}
                    unoptimized
                  />
                ) : (
                  <span aria-hidden='true' className={S.imageFallbackClassName} />
                )}
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
              {product.discountRate > 0 && (
                <PointChip className={S.discountChipClassName} size='mobile'>
                  {product.discountRate}%
                </PointChip>
              )}
            </Link>
          ))}
        </div>
      )}

      {canToggle ? (
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
      ) : null}
    </section>
  );
};
