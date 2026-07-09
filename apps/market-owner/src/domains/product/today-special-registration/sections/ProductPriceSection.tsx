import type { ChangeEventHandler, FocusEventHandler } from 'react';

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
          <FieldGroup
            errorMessage={productErrorMessages.specialPrice}
            id='today-special-special-price'
            inputMode='numeric'
            label='오늘의 특가'
            onBlur={onSpecialPriceBlur}
            onChange={onSpecialPriceChange}
            placeholder='오늘의 특가를 입력하세요.'
            status={productErrorMessages.specialPrice ? 'error' : 'default'}
            unit='원'
            value={product.specialPrice}
          />

          <FieldGroup
            errorMessage={productErrorMessages.salePrice}
            id='today-special-sale-price'
            inputMode='numeric'
            label='판매가'
            onBlur={onSalePriceBlur}
            onChange={onSalePriceChange}
            placeholder='판매가를 입력하세요.'
            status={productErrorMessages.salePrice ? 'error' : 'default'}
            unit='원'
            value={product.salePrice}
          />
        </div>
      </div>
    </section>
  );
};
