import { IcChevronDown, IcChevronUp } from '@dongchimi/design-system/icons';

import { PeriodProductCard } from '@/shared/components/ui/period-product-card';
import { CLIENT_ROUTES } from '@/shared/constants';

import type {
  EventDiscountCategoryFixtureTypes,
  EventDiscountProductFixtureTypes,
} from '../fixtures/market-products.fixture';
import * as S from '../MarketProductsPage.css';

interface EventDiscountProductsSectionProps {
  categories: EventDiscountCategoryFixtureTypes[];
  isCategoryExpanded: boolean;
  marketId: string;
  onSelectCategory: (categoryId: string) => void;
  onToggleCategoryExpanded: () => void;
  products: EventDiscountProductFixtureTypes[];
  selectedCategoryId: string;
  visibleCategoryCount: number;
}

export const EVENT_DISCOUNT_ALL_CATEGORY_ID = 'all';

const formatPrice = (price: number) => price.toLocaleString('ko-KR');

export const EventDiscountProductsSection = ({
  categories,
  isCategoryExpanded,
  marketId,
  onSelectCategory,
  onToggleCategoryExpanded,
  products,
  selectedCategoryId,
  visibleCategoryCount,
}: EventDiscountProductsSectionProps) => {
  const visibleCategories = isCategoryExpanded
    ? categories
    : categories.slice(0, visibleCategoryCount);
  const hasHiddenCategories = categories.length > visibleCategoryCount;
  const moreButtonLabel = isCategoryExpanded ? '접기' : '더보기';
  const MoreButtonIcon = isCategoryExpanded ? IcChevronUp : IcChevronDown;

  return (
    <section aria-labelledby='event-discount-products-title' className={S.cardSectionClassName}>
      <h2 className={S.sectionTitleClassName} id='event-discount-products-title'>
        행사 할인 상품
      </h2>

      <div aria-label='행사 할인 상품 카테고리' className={S.categoryListClassName}>
        <button
          aria-pressed={selectedCategoryId === EVENT_DISCOUNT_ALL_CATEGORY_ID}
          className={S.categoryButtonClassName}
          onClick={() => onSelectCategory(EVENT_DISCOUNT_ALL_CATEGORY_ID)}
          type='button'
        >
          전체
        </button>
        {visibleCategories.map((category) => (
          <button
            key={category.categoryId}
            aria-pressed={selectedCategoryId === category.categoryId}
            className={S.categoryButtonClassName}
            onClick={() => onSelectCategory(category.categoryId)}
            type='button'
          >
            {category.label}
          </button>
        ))}
        {hasHiddenCategories ? (
          <button
            aria-expanded={isCategoryExpanded}
            className={S.moreCategoryButtonClassName}
            onClick={onToggleCategoryExpanded}
            type='button'
          >
            {moreButtonLabel}
            <MoreButtonIcon aria-hidden='true' />
          </button>
        ) : null}
      </div>

      {products.length > 0 ? (
        <div className={S.eventProductGridClassName}>
          {products.map((product) => (
            <PeriodProductCard
              key={product.productId}
              className={S.eventProductCardClassName}
              href={CLIENT_ROUTES.marketProduct(marketId, String(product.productId))}
              imageSrc={product.thumbnailUrl ?? undefined}
              priceText={formatPrice(product.discountedPrice)}
              productName={product.name}
            />
          ))}
        </div>
      ) : (
        <p className={S.emptyTextClassName}>해당 카테고리에 등록된 상품이 없어요.</p>
      )}
    </section>
  );
};
