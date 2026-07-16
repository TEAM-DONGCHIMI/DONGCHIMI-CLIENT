import { type ChangeEventHandler } from 'react';

import { Button } from '@dongchimi/design-system/components';
import { IcCalendarPlusSizeSmall, IcLineHorizontalSizeSmall } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { getProductDateMinimum } from '../../utils/product-date';
import { DateField } from '../date-field';
import * as Content from './ProductEditModalContent.css';
import * as S from './ProductPeriodSection.css';

interface ProductPeriodSectionProps {
  endDate: string;
  isTodaySpecial: boolean;
  sectionClassName: string;
  startDate: string;
  contentClassName?: string;
  onEndDateChange: ChangeEventHandler<HTMLInputElement>;
  onStartDateChange: ChangeEventHandler<HTMLInputElement>;
  onToggleTodayOnlyPeriod: () => void;
}

export const ProductPeriodSection = ({
  contentClassName,
  endDate,
  isTodaySpecial,
  sectionClassName,
  startDate,
  onEndDateChange,
  onStartDateChange,
  onToggleTodayOnlyPeriod,
}: ProductPeriodSectionProps) => {
  const isTodayOnly = startDate === endDate;

  return (
    <section className={sectionClassName}>
      <h3 className={Content.sectionTitleClassName}>기간 설정</h3>
      <div className={cn(S.contentClassName, contentClassName)}>
        <div className={Content.fieldGroupClassName}>
          <span className={Content.fieldLabelClassName}>행사 기간</span>
          <div className={S.dateRowClassName}>
            <div className={Content.dateRangeClassName}>
              <DateField
                ariaLabel='행사 시작일'
                className={S.dateFieldClassName}
                readOnly={isTodaySpecial}
                value={startDate}
                onChange={onStartDateChange}
              />
              <span className={Content.dateDividerClassName}>~</span>
              <DateField
                ariaLabel='행사 종료일'
                className={S.dateFieldClassName}
                min={getProductDateMinimum(startDate)}
                pickerDisabled={isTodaySpecial}
                value={endDate}
                onChange={onEndDateChange}
              />
            </div>
            {isTodaySpecial && (
              <Button
                className={Content.periodToggleButtonClassName}
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
                onClick={onToggleTodayOnlyPeriod}
              >
                {isTodayOnly ? '하루 더 늘리기' : '오늘만 특가로'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
