import { useNavigate } from 'react-router';

import { ProductCard, type ProductCardProps } from '@dongchimi/shared';

import { homeProductSections } from '../fixtures';
import * as S from '../HomePage.css';

const TODAY_SPECIAL_VISIBLE_COUNT = 4;

export const HomeProductSummarySection = () => {
  const navigate = useNavigate();

  const handleProductClick = (section: (typeof homeProductSections)[number]) => {
    const onProductClick: ProductCardProps['onProductClick'] = (item) => {
      navigate(section.editRoute, { state: { productId: item.id } });
    };

    return onProductClick;
  };

  return (
    <>
      {homeProductSections.map((section) => (
        <ProductCard
          className={S.productCardClassName}
          id={section.id}
          initialVisibleCount={TODAY_SPECIAL_VISIBLE_COUNT}
          itemVariant={section.itemVariant}
          items={section.items}
          key={section.id}
          onProductClick={handleProductClick(section)}
          title={section.title}
          totalCount={section.totalCount}
          actionSlot={
            <button
              className={S.productCardActionButtonClassName}
              onClick={() => navigate(section.editRoute)}
              type='button'
            >
              등록한 상품 전체보기
            </button>
          }
        />
      ))}
    </>
  );
};
