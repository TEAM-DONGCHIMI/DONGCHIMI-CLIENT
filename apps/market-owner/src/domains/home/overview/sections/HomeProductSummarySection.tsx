import { useNavigate } from 'react-router';

import { ProductCard, type ProductCardProps } from '@dongchimi/shared';

import { homeProductSections, type HomeProductSectionFixtureTypes } from '../fixtures';
import * as S from '../HomePage.css';

const TODAY_SPECIAL_VISIBLE_COUNT = 4;
const EMPTY_PRODUCT_MESSAGE = '등록한 상품이 없어요.\n상품을 먼저 등록해주세요.';

export interface HomeProductSummarySectionProps {
  sections?: readonly HomeProductSectionFixtureTypes[];
}

export const HomeProductSummarySection = ({
  sections = homeProductSections,
}: HomeProductSummarySectionProps) => {
  const navigate = useNavigate();

  const handleProductClick = (section: HomeProductSectionFixtureTypes) => {
    const onProductClick: ProductCardProps['onProductClick'] = (item) => {
      navigate(section.editRoute, { state: { productId: item.id } });
    };

    return onProductClick;
  };

  return (
    <>
      {sections.map((section) => {
        const isEmpty = section.totalCount === 0;

        return (
          <div className={S.dashboardCardContainerClassName} key={section.id}>
            <ProductCard
              className={S.productCardClassName}
              emptyMessage={isEmpty ? '' : undefined}
              id={section.id}
              initialVisibleCount={TODAY_SPECIAL_VISIBLE_COUNT}
              itemVariant={section.itemVariant}
              items={isEmpty ? [] : section.items}
              onProductClick={handleProductClick(section)}
              title={section.title}
              totalCount={section.totalCount}
              actionSlot={
                <button
                  className={S.productCardActionButtonClassName}
                  disabled={isEmpty}
                  onClick={() => navigate(section.editRoute)}
                  type='button'
                >
                  등록한 상품 전체보기
                </button>
              }
            />

            {isEmpty && (
              <div className={S.dashboardCardEmptyOverlayClassName}>
                <p className={S.dashboardCardEmptyMessageClassName}>{EMPTY_PRODUCT_MESSAGE}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
