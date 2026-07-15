import { IconButton } from '@dongchimi/design-system/components';
import {
  IcChevronLeft,
  IcChevronRight,
  IcLineHorizontalSizeSmall,
} from '@dongchimi/design-system/icons';

import * as S from '../today-special-registration-page.css';

interface RegistrationTitleSectionProps {
  canCancelCurrentDraft: boolean;
  canDeleteRegisteredProduct: boolean;
  currentIndex: number;
  isInteractionPending: boolean;
  onCancelCurrentDraft: () => void;
  onDeleteRegisteredProduct: () => void;
  onNextProduct: () => void;
  onPreviousProduct: () => void;
  productCount: number;
}

export const RegistrationTitleSection = ({
  canCancelCurrentDraft,
  canDeleteRegisteredProduct,
  currentIndex,
  isInteractionPending,
  onCancelCurrentDraft,
  onDeleteRegisteredProduct,
  onNextProduct,
  onPreviousProduct,
  productCount,
}: RegistrationTitleSectionProps) => {
  const shouldShowProductControls = productCount > 1;
  const shouldShowRemoveButton = canCancelCurrentDraft || canDeleteRegisteredProduct;

  return (
    <header className={S.titleSectionClassName}>
      <div className={S.titleContentClassName}>
        <div className={S.titleMainClassName}>
          <h1 className={S.titleClassName} id='today-special-registration-title'>
            오늘의 특가 상품을 등록하세요
            {shouldShowProductControls && (
              <span className={S.titleCountClassName}>
                (<span className={S.titleCurrentCountClassName}>{currentIndex + 1}</span>/
                {productCount})
              </span>
            )}
          </h1>

          {shouldShowProductControls && (
            <div className={S.titleButtonGroupClassName} aria-label='등록 상품 전환'>
              <IconButton
                aria-label='이전 상품'
                className={S.titleNavigationButtonClassName}
                color='assistive'
                disabled={isInteractionPending || currentIndex === 0}
                icon={<IcChevronLeft />}
                onClick={onPreviousProduct}
                type='button'
                variant='ghost'
              />
              <IconButton
                aria-label='다음 상품'
                className={S.titleNavigationButtonClassName}
                color='assistive'
                disabled={isInteractionPending || currentIndex === productCount - 1}
                icon={<IcChevronRight />}
                onClick={onNextProduct}
                type='button'
                variant='ghost'
              />
            </div>
          )}
        </div>

        {shouldShowRemoveButton && (
          <IconButton
            aria-label={canDeleteRegisteredProduct ? '등록 상품 삭제' : '현재 상품 등록 취소'}
            className={S.titleRemoveButtonClassName}
            color='assistive'
            disabled={isInteractionPending}
            icon={<IcLineHorizontalSizeSmall />}
            onClick={canDeleteRegisteredProduct ? onDeleteRegisteredProduct : onCancelCurrentDraft}
            type='button'
            variant='outlined'
          />
        )}
      </div>
    </header>
  );
};
