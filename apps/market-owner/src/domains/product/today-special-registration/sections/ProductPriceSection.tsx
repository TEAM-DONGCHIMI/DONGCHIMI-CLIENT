import type { ChangeEventHandler, FocusEventHandler } from 'react';

import { InlineField } from '@dongchimi/design-system/components';

import { FieldGroup } from '../components/FieldGroup';
import type { TodaySpecialProductErrorMessageTypes, TodaySpecialProductFormTypes } from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductPriceSectionProps {
  onSalePriceBlur: FocusEventHandler<HTMLInputElement>;
  onSalePriceChange: ChangeEventHandler<HTMLInputElement>;
  onSpecialPriceBlur: FocusEventHandler<HTMLInputElement>;
  onSpecialPriceChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductFormTypes;
  productErrorMessages: TodaySpecialProductErrorMessageTypes;
}

export const ProductPriceSection = ({
  onSalePriceBlur,
  onSalePriceChange,
  onSpecialPriceBlur,
  onSpecialPriceChange,
  product,
  productErrorMessages,
}: ProductPriceSectionProps) => {
  return (
    <section className={S.fieldSectionClassName} aria-labelledby='product-price-title'>
      <h2 className={S.sectionTitleClassName} id='product-price-title'>
        상품 가격
      </h2>

      <div className={S.sectionBodyClassName}>
        <div className={S.twoColumnRowClassName}>
          <FieldGroup htmlFor='today-special-special-price' label='오늘의 특가'>
            <InlineField
              aria-label='오늘의 특가'
              errorMessage={productErrorMessages.specialPrice}
              id='today-special-special-price'
              inputMode='numeric'
              onBlur={onSpecialPriceBlur}
              onChange={onSpecialPriceChange}
              placeholder='오늘의 특가를 입력하세요.'
              status={productErrorMessages.specialPrice ? 'error' : 'default'}
              unit='원'
              value={product.specialPrice}
            />
          </FieldGroup>

          <FieldGroup htmlFor='today-special-sale-price' label='판매가'>
            <InlineField
              aria-label='판매가'
              errorMessage={productErrorMessages.salePrice}
              id='today-special-sale-price'
              inputMode='numeric'
              onBlur={onSalePriceBlur}
              onChange={onSalePriceChange}
              placeholder='판매가를 입력하세요.'
              status={productErrorMessages.salePrice ? 'error' : 'default'}
              unit='원'
              value={product.salePrice}
            />
          </FieldGroup>
        </div>
      </div>
    </section>
  );
};
