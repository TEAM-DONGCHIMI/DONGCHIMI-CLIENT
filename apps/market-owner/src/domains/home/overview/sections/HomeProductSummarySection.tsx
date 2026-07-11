import { useNavigate } from 'react-router';

import { TextButton } from '@dongchimi/design-system/components';
import { ProductCard, type ProductCardProps } from '@dongchimi/shared';

import { homeProductSections, type HomeProductSectionFixtureTypes } from '../fixtures';
import * as S from '../HomePage.css';

const PRODUCT_INITIAL_VISIBLE_COUNT = 4;
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
        const emptyMessageId = `${section.id}-empty-message`;

        return (
          <div className={S.dashboardCardContainerClassName} key={section.id}>
            <ProductCard
              aria-describedby={isEmpty ? emptyMessageId : undefined}
              className={S.productCardClassName}
              emptyMessage={isEmpty ? '' : undefined}
              id={section.id}
              initialVisibleCount={PRODUCT_INITIAL_VISIBLE_COUNT}
              itemVariant={section.itemVariant}
              items={isEmpty ? [] : section.items}
              onProductClick={handleProductClick(section)}
              title={section.title}
              totalCount={section.totalCount}
              actionSlot={
                <TextButton
                  className={S.productCardActionButtonClassName}
                  disabled={isEmpty}
                  onClick={() => navigate(section.editRoute)}
                >
                  등록한 상품 전체보기
                </TextButton>
              }
            />

            {isEmpty && (
              <div className={S.dashboardCardEmptyOverlayClassName}>
                <p className={S.dashboardCardEmptyMessageClassName} id={emptyMessageId}>
                  {EMPTY_PRODUCT_MESSAGE}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
