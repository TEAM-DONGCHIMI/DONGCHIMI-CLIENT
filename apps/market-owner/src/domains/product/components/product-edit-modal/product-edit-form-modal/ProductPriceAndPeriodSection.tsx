import { InlineField } from '@dongchimi/design-system/components';

import { type ProductEditCardVariantTypes } from '../../product-edit-product-list';
import { ProductPeriodSection } from '../ProductPeriodSection';
import * as S from './ProductEditModal.css';
import { type ProductEditFormControllerTypes } from './use-product-edit-form';

interface ProductPriceAndPeriodSectionProps extends Pick<
  ProductEditFormControllerTypes,
  'toggleTodayOnlyPeriod' | 'updateValue' | 'values'
> {
  variant: ProductEditCardVariantTypes;
}

export const ProductPriceAndPeriodSection = ({
  toggleTodayOnlyPeriod,
  updateValue,
  values,
  variant,
}: ProductPriceAndPeriodSectionProps) => {
  const isTodaySpecial = variant === 'todaySpecial';

  return (
    <>
      <section className={S.sectionClassName}>
        <h3 className={S.sectionTitleClassName}>상품 가격</h3>
        <div className={S.formColumnClassName}>
          <div className={S.priceGridRecipe({ variant })}>
            {isTodaySpecial && (
              <div className={S.fieldGroupClassName}>
                <span className={S.fieldLabelClassName}>원가</span>
                <InlineField
                  aria-label='원가'
                  inputMode='numeric'
                  unit='원'
                  value={values.originalPrice}
                  onChange={updateValue('originalPrice')}
                />
              </div>
            )}
            <div className={S.fieldGroupClassName}>
              <span className={S.fieldLabelClassName}>
                {isTodaySpecial ? '오늘의 특가' : '판매가'}
              </span>
              <InlineField
                aria-label={isTodaySpecial ? '오늘의 특가' : '판매가'}
                inputMode='numeric'
                unit='원'
                value={values.salePrice}
                onChange={updateValue('salePrice')}
              />
            </div>
          </div>
        </div>
      </section>

      <ProductPeriodSection
        contentClassName={S.formColumnClassName}
        endDate={values.endDate}
        isTodaySpecial={isTodaySpecial}
        sectionClassName={S.sectionClassName}
        startDate={values.startDate}
        onEndDateChange={updateValue('endDate')}
        onStartDateChange={updateValue('startDate')}
        onToggleTodayOnlyPeriod={toggleTodayOnlyPeriod}
      />
    </>
  );
};
