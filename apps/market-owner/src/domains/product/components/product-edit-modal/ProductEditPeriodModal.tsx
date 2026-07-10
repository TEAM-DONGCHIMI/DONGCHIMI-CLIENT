import { useState, type ChangeEventHandler } from 'react';

import { Button, Dialog } from '@dongchimi/design-system/components';

import { addOneDayToProductEditDate } from '../../utils/product-edit-date';
import { DateField } from '../date-field';
import { type ProductEditTypeTypes } from '../product-edit-page-shell';
import { openProductEditOverlay } from './open-product-edit-overlay';
import { ProductEditPeriodToggleButton } from './ProductEditPeriodToggleButton';
import * as S from './ProductEditPeriodModal.css';

interface ProductEditPeriodModalProps {
  open: boolean;
  variant: ProductEditTypeTypes;
  onClose: () => void;
}

interface OpenProductEditPeriodModalParams {
  variant: ProductEditTypeTypes;
}

const DEFAULT_PERIOD_DATE = '2026-08-16';

export const ProductEditPeriodModal = ({ open, variant, onClose }: ProductEditPeriodModalProps) => {
  const initialPeriod = {
    endDate: DEFAULT_PERIOD_DATE,
    startDate: DEFAULT_PERIOD_DATE,
  };
  const [startDate, setStartDate] = useState(DEFAULT_PERIOD_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_PERIOD_DATE);
  const isTodaySpecial = variant === 'todaySpecial';
  const isTodayOnly = startDate === endDate;
  const isEdited = startDate !== initialPeriod.startDate || endDate !== initialPeriod.endDate;

  const updateStartDate: ChangeEventHandler<HTMLInputElement> = (event) => {
    setStartDate(event.target.value);
  };

  const updateEndDate: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEndDate(event.target.value);
  };

  const toggleTodayOnlyPeriod = () => {
    setEndDate((currentEndDate) =>
      currentEndDate === startDate ? addOneDayToProductEditDate(currentEndDate) : startDate,
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <Dialog.Content className={S.contentClassName}>
        <div className={S.containerClassName}>
          <Dialog.Title className={S.titleClassName}>
            선택된 상품들의 판매 기간을 수정해주세요
          </Dialog.Title>

          <section className={S.sectionClassName}>
            <h3 className={S.sectionTitleClassName}>기간 설정</h3>
            <div className={S.fieldGroupClassName}>
              <span className={S.fieldLabelClassName}>행사 기간</span>
              <div className={S.dateRowClassName}>
                <DateField
                  ariaLabel='행사 시작일'
                  className={S.dateFieldClassName}
                  readOnly={isTodaySpecial}
                  value={startDate}
                  onChange={updateStartDate}
                />
                <span className={S.dateDividerClassName}>~</span>
                <DateField
                  ariaLabel='행사 종료일'
                  className={S.dateFieldClassName}
                  value={endDate}
                  onChange={updateEndDate}
                />
                {isTodaySpecial && (
                  <ProductEditPeriodToggleButton
                    isTodayOnly={isTodayOnly}
                    onClick={toggleTodayOnlyPeriod}
                  />
                )}
              </div>
            </div>
          </section>

          <div className={S.footerClassName}>
            <Button
              className={S.footerButtonClassName}
              color='assistive'
              size='small'
              variant='outlined'
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              className={S.footerButtonClassName}
              disabled={!isEdited}
              size='small'
              variant='solid'
              onClick={onClose}
            >
              변경하기
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export const openProductEditPeriodModal = ({ variant }: OpenProductEditPeriodModalParams) => {
  openProductEditOverlay({
    render: ({ closeOverlay, isOpen }) => (
      <ProductEditPeriodModal open={isOpen} variant={variant} onClose={closeOverlay} />
    ),
  });
};
