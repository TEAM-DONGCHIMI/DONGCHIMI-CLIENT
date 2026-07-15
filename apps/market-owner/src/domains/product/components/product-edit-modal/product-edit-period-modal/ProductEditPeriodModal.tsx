import { useState, type ChangeEventHandler } from 'react';

import { Button, Dialog } from '@dongchimi/design-system/components';
import { IcCalendarPlusSizeSmall, IcLineHorizontalSizeSmall } from '@dongchimi/design-system/icons';

import { useProductDiscountPeriodUpdateFlow } from '@/domains/product/hooks';

import {
  addOneDayToProductEditDate,
  formatProductEditDateForInput,
  getProductDateMinimum,
  isProductEditDateRangeValid,
  isProductEditDateTodayOrFuture,
} from '../../../utils/product-date';
import { DateField } from '../../date-field';
import { type ProductEditTypeTypes } from '../../product-edit-page-shell';
import { useProductEditModalContentFocus } from '../hooks/use-product-edit-modal-content-focus';
import { keepProductEditDialogOpen, openProductEditOverlay } from '../open-product-edit-overlay';
import * as S from './ProductEditPeriodModal.css';

interface ProductEditPeriodModalProps {
  initialPeriod?: ProductEditPeriodValues;
  isSubmitting?: boolean;
  open: boolean;
  variant: ProductEditTypeTypes;
  onClose: () => void;
  onSubmit?: (period: Required<ProductEditPeriodValues>) => Promise<boolean>;
}

interface OpenProductEditPeriodModalParams {
  initialPeriod?: ProductEditPeriodValues;
  marketId: number;
  onClose?: () => void;
  onSubmit?: (period: Required<ProductEditPeriodValues>) => void;
  productIds: number[];
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
  isSubmitting = false,
  open,
  variant,
  onClose,
  onSubmit,
}: ProductEditPeriodModalProps) => {
  const contentRef = useProductEditModalContentFocus(open);
  const [initialPeriod] = useState(() => createInitialPeriod(initialPeriodProp));
  const [startDate, setStartDate] = useState(initialPeriod.startDate);
  const [endDate, setEndDate] = useState(initialPeriod.endDate);
  const isTodaySpecial = variant === 'todaySpecial';
  const isTodayOnly = startDate === endDate;
  const isEdited = startDate !== initialPeriod.startDate || endDate !== initialPeriod.endDate;
  const isStartDateValid = isTodaySpecial || isProductEditDateTodayOrFuture(startDate);
  const isDateRangeValid = isProductEditDateRangeValid(startDate, endDate);

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

  const submitPeriod = async () => {
    const didUpdate = await onSubmit?.({
      endDate,
      startDate,
    });

    if (didUpdate) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={keepProductEditDialogOpen}>
      <Dialog.Content ref={contentRef} className={S.contentClassName}>
        <div aria-busy={isSubmitting} className={S.containerClassName}>
          <Dialog.Title className={S.titleClassName}>
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
                    min={getProductDateMinimum(startDate)}
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
              disabled={isSubmitting}
              size='small'
              variant='outlined'
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              className={S.footerButtonClassName}
              disabled={isSubmitting || !isEdited || !isStartDateValid || !isDateRangeValid}
              size='small'
              variant='solid'
              onClick={submitPeriod}
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
  marketId,
  onClose,
  onSubmit,
  productIds,
  variant,
}: OpenProductEditPeriodModalParams) => {
  openProductEditOverlay({
    render: ({ closeOverlay, isOpen }) => {
      const closePeriodModal = () => {
        closeOverlay();
        onClose?.();
      };

      return (
        <ProductEditPeriodModalContainer
          initialPeriod={initialPeriod}
          marketId={marketId}
          open={isOpen}
          productIds={productIds}
          variant={variant}
          onClose={closePeriodModal}
          onSubmit={onSubmit}
        />
      );
    },
  });
};

interface ProductEditPeriodModalContainerProps extends Omit<
  ProductEditPeriodModalProps,
  'isSubmitting' | 'onSubmit'
> {
  marketId: number;
  onSubmit?: (period: Required<ProductEditPeriodValues>) => void;
  productIds: number[];
}

const ProductEditPeriodModalContainer = ({
  marketId,
  productIds,
  onSubmit,
  ...modalProps
}: ProductEditPeriodModalContainerProps) => {
  const updateFlow = useProductDiscountPeriodUpdateFlow();
  const submitPeriod = async (period: Required<ProductEditPeriodValues>) => {
    const didUpdate = await updateFlow.submitProductDiscountPeriodUpdate({
      endDate: period.endDate,
      marketId,
      productIds,
      startDate: period.startDate,
    });

    if (didUpdate) {
      onSubmit?.(period);
    }

    return didUpdate;
  };

  return (
    <ProductEditPeriodModal
      {...modalProps}
      isSubmitting={updateFlow.isPending}
      onSubmit={submitPeriod}
    />
  );
};
