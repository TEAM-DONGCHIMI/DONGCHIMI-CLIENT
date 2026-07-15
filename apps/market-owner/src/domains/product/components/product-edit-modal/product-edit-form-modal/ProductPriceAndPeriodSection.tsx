import { Button, InlineField } from '@dongchimi/design-system/components';
import { IcCalendarPlusSizeSmall, IcLineHorizontalSizeSmall } from '@dongchimi/design-system/icons';

import { getProductDateMinimum } from '../../../utils/product-date';
import { type ProductEditCardVariantTypes } from '../../product-edit-product-list';
import { DateField } from '../../date-field';
import * as S from './ProductEditModal.css';
import { type ProductEditFormControllerTypes } from './use-product-edit-form';

interface ProductPriceAndPeriodSectionProps extends Pick<
  ProductEditFormControllerTypes,
  'isTodayOnly' | 'toggleTodayOnlyPeriod' | 'updateValue' | 'values'
> {
  variant: ProductEditCardVariantTypes;
}

export const ProductPriceAndPeriodSection = ({
  isTodayOnly,
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

      <section className={S.sectionClassName}>
        <h3 className={S.sectionTitleClassName}>기간 설정</h3>
        <div className={S.formColumnClassName}>
          <div className={S.fieldGroupClassName}>
            <span className={S.fieldLabelClassName}>행사 기간</span>
            <div className={S.dateRowClassName}>
              <div className={S.dateRangeClassName}>
                <DateField
                  ariaLabel='행사 시작일'
                  className={S.dateFieldClassName}
                  readOnly={isTodaySpecial}
                  value={values.startDate}
                  onChange={updateValue('startDate')}
                />
                <span className={S.dateDividerClassName}>~</span>
                <DateField
                  ariaLabel='행사 종료일'
                  className={S.dateFieldClassName}
                  min={getProductDateMinimum(values.startDate)}
                  value={values.endDate}
                  onChange={updateValue('endDate')}
                />
              </div>
              {isTodaySpecial && (
                <Button
                  className={S.periodToggleButtonClassName}
                  color='assistive'
                  rightIcon={
                    isTodayOnly ? (
                      <IcCalendarPlusSizeSmall aria-hidden='true' />
                    ) : (
                      <IcLineHorizontalSizeSmall aria-hidden='true' />
                    )
                  }
                  size='small'
                  type='button'
                  variant='outlined'
                  onClick={toggleTodayOnlyPeriod}
                >
                  {isTodayOnly ? '하루 더 늘리기' : '오늘만 특가로'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
