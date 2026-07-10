import { useState, type ChangeEventHandler } from 'react';

import { Button, Dialog } from '@dongchimi/design-system/components';
import { IcCalendarPlusSizeSmall, IcLineHorizontalSizeSmall } from '@dongchimi/design-system/icons';

import {
  addOneDayToProductEditDate,
  formatProductEditDateForInput,
} from '../../../utils/product-edit-date';
import { DateField } from '../../date-field';
import { type ProductEditTypeTypes } from '../../product-edit-page-shell';
import { useProductEditModalTitleFocus } from '../hooks/use-product-edit-modal-title-focus';
import { keepProductEditDialogOpen, openProductEditOverlay } from '../open-product-edit-overlay';
import * as S from './ProductEditPeriodModal.css';

interface ProductEditPeriodModalProps {
  initialPeriod?: ProductEditPeriodValues;
  open: boolean;
  variant: ProductEditTypeTypes;
  onClose: () => void;
}

interface OpenProductEditPeriodModalParams {
  initialPeriod?: ProductEditPeriodValues;
  onClose?: () => void;
  variant: ProductEditTypeTypes;
}

interface ProductEditPeriodValues {
  endDate?: string;
  startDate?: string;
}

const createInitialPeriod = (period?: ProductEditPeriodValues) => {
  const endDate = formatProductEditDateForInput(period?.endDate);
  const startDate = formatProductEditDateForInput(period?.startDate ?? period?.endDate);

  return {
    endDate,
    startDate,
  };
};

export const ProductEditPeriodModal = ({
  initialPeriod: initialPeriodProp,
  open,
  variant,
  onClose,
}: ProductEditPeriodModalProps) => {
  const titleRef = useProductEditModalTitleFocus(open);
  const [initialPeriod] = useState(() => createInitialPeriod(initialPeriodProp));
  const [startDate, setStartDate] = useState(initialPeriod.startDate);
  const [endDate, setEndDate] = useState(initialPeriod.endDate);
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
    <Dialog open={open} onOpenChange={keepProductEditDialogOpen}>
      <Dialog.Content className={S.contentClassName}>
        <div className={S.containerClassName}>
          <Dialog.Title ref={titleRef} className={S.titleClassName} tabIndex={-1}>
            선택된 상품들의 판매 기간을 수정해주세요
          </Dialog.Title>

          <section className={S.sectionClassName}>
            <h3 className={S.sectionTitleClassName}>기간 설정</h3>
            <div className={S.fieldGroupClassName}>
              <span className={S.fieldLabelClassName}>행사 기간</span>
              <div className={S.dateRowClassName}>
                <div className={S.dateRangeClassName}>
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

export const openProductEditPeriodModal = ({
  initialPeriod,
  onClose,
  variant,
}: OpenProductEditPeriodModalParams) => {
  openProductEditOverlay({
    render: ({ closeOverlay, isOpen }) => {
      const closePeriodModal = () => {
        closeOverlay();
        onClose?.();
      };

      return (
        <ProductEditPeriodModal
          initialPeriod={initialPeriod}
          open={isOpen}
          variant={variant}
          onClose={closePeriodModal}
        />
      );
    },
  });
};
