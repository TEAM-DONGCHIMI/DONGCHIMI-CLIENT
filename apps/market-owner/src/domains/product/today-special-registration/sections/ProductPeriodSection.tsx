import type { ChangeEventHandler, FocusEventHandler } from 'react';

import { DateField } from '../components/DateField';
import { FieldErrorMessage } from '../components/FieldErrorMessage';
import type { TodaySpecialProductErrorMessageTypes, TodaySpecialProductForm } from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductPeriodSectionProps {
  onEndDateBlur: FocusEventHandler<HTMLInputElement>;
  onEndDateChange: ChangeEventHandler<HTMLInputElement>;
  onStartDateBlur: FocusEventHandler<HTMLInputElement>;
  onStartDateChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductForm;
  productErrorMessages: TodaySpecialProductErrorMessageTypes;
}

export const ProductPeriodSection = ({
  onEndDateBlur,
  onEndDateChange,
  onStartDateBlur,
  onStartDateChange,
  product,
  productErrorMessages,
}: ProductPeriodSectionProps) => {
  const startDateErrorId = 'today-special-start-date-error';
  const endDateErrorId = 'today-special-end-date-error';

  return (
    <section className={S.fieldSectionClassName} aria-labelledby='period-title'>
      <h2 className={S.sectionTitleClassName} id='period-title'>
        기간 설정
      </h2>

      <div className={S.sectionBodyClassName}>
        <div className={S.fieldGroupClassName}>
          <span className={S.fieldLabelClassName}>행사 기간</span>
          <div className={S.dateRowClassName}>
            <div className={S.dateFieldGroupClassName}>
              <DateField
                ariaLabel='행사 시작일'
                describedBy={productErrorMessages.startDate ? startDateErrorId : undefined}
                hasError={Boolean(productErrorMessages.startDate)}
                onBlur={onStartDateBlur}
                onChange={onStartDateChange}
                value={product.startDate}
              />
              {productErrorMessages.startDate && (
                <FieldErrorMessage id={startDateErrorId} message={productErrorMessages.startDate} />
              )}
            </div>
            <span className={S.dateSeparatorClassName} aria-hidden='true'>
              ~
            </span>
            <div className={S.dateFieldGroupClassName}>
              <DateField
                ariaLabel='행사 종료일'
                describedBy={productErrorMessages.endDate ? endDateErrorId : undefined}
                hasError={Boolean(productErrorMessages.endDate)}
                min={product.startDate || undefined}
                onBlur={onEndDateBlur}
                onChange={onEndDateChange}
                value={product.endDate}
              />
              {productErrorMessages.endDate && (
                <FieldErrorMessage id={endDateErrorId} message={productErrorMessages.endDate} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
