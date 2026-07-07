import type { ChangeEventHandler } from 'react';

import { InlineField } from '@dongchimi/design-system/components';

import type { TodaySpecialProductForm } from '../model';
import * as S from '../TodaySpecialRegistrationPage.css';

interface ProductPeriodSectionProps {
  onEndDateChange: ChangeEventHandler<HTMLInputElement>;
  onStartDateChange: ChangeEventHandler<HTMLInputElement>;
  product: TodaySpecialProductForm;
}

export const ProductPeriodSection = ({
  onEndDateChange,
  onStartDateChange,
  product,
}: ProductPeriodSectionProps) => {
  return (
    <section className={S.fieldSectionClassName} aria-labelledby='period-title'>
      <h2 className={S.sectionTitleClassName} id='period-title'>
        기간 설정
      </h2>

      <div className={S.sectionBodyClassName}>
        <div className={S.fieldGroupClassName}>
          <span className={S.fieldLabelClassName}>행사 기간</span>
          <div className={S.dateRowClassName}>
            <InlineField
              aria-label='행사 시작일'
              onChange={onStartDateChange}
              placeholder='YYYY-MM-DD'
              value={product.startDate}
            />
            <span className={S.dateSeparatorClassName} aria-hidden='true'>
              ~
            </span>
            <InlineField
              aria-label='행사 종료일'
              onChange={onEndDateChange}
              placeholder='YYYY-MM-DD'
              value={product.endDate}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
