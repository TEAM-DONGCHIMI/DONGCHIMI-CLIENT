import type { ChangeEventHandler, FocusEventHandler } from 'react';

import { DateField } from '../components/DateField';
import type { TodaySpecialProductErrorMessageTypes, TodaySpecialProductFormTypes } from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductPeriodSectionProps {
  onStartDateBlur: FocusEventHandler<HTMLInputElement>;
  onStartDateChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductFormTypes;
  productErrorMessages: TodaySpecialProductErrorMessageTypes;
}

export const ProductPeriodSection = ({
  onStartDateBlur,
  onStartDateChange,
  product,
  productErrorMessages,
}: ProductPeriodSectionProps) => {
  return (
    <section className={S.fieldSectionClassName} aria-labelledby='period-title'>
      <h2 className={S.sectionTitleClassName} id='period-title'>
        기간 설정
      </h2>

      <div className={S.sectionBodyClassName}>
        <div className={S.fieldGroupClassName}>
          <span className={S.fieldLabelClassName}>행사 기간</span>
          <div className={S.dateSingleFieldClassName}>
            <DateField
              ariaLabel='행사 시작일'
              errorMessage={productErrorMessages.startDate}
              hasError={Boolean(productErrorMessages.startDate)}
              onBlur={onStartDateBlur}
              onChange={onStartDateChange}
              value={product.startDate}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
