import type { ChangeEventHandler } from 'react';

import { InlineField } from '@dongchimi/design-system/components';

import type { TodaySpecialProductForm } from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductPriceSectionProps {
  onSalePriceChange: ChangeEventHandler<HTMLInputElement>;
  onSpecialPriceChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductForm;
}

export const ProductPriceSection = ({
  onSalePriceChange,
  onSpecialPriceChange,
  product,
}: ProductPriceSectionProps) => {
  return (
    <section className={S.fieldSectionClassName} aria-labelledby='product-price-title'>
      <h2 className={S.sectionTitleClassName} id='product-price-title'>
        상품 가격
      </h2>

      <div className={S.sectionBodyClassName}>
        <div className={S.twoColumnRowClassName}>
          <div className={S.fieldGroupClassName}>
            <label className={S.fieldLabelClassName} htmlFor='today-special-special-price'>
              오늘의 특가
            </label>
            <InlineField
              aria-label='오늘의 특가'
              id='today-special-special-price'
              inputMode='numeric'
              onChange={onSpecialPriceChange}
              placeholder='오늘의 특가를 입력하세요.'
              unit='원'
              value={product.specialPrice}
            />
          </div>

          <div className={S.fieldGroupClassName}>
            <label className={S.fieldLabelClassName} htmlFor='today-special-sale-price'>
              판매가
            </label>
            <InlineField
              aria-label='판매가'
              id='today-special-sale-price'
              inputMode='numeric'
              onChange={onSalePriceChange}
              placeholder='판매가를 입력하세요.'
              unit='원'
              value={product.salePrice}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
