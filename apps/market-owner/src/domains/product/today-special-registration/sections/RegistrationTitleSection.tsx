import { IconButton } from '@dongchimi/design-system/components';
import {
  IcChevronLeft,
  IcChevronRight,
  IcLineHorizontalSizeSmall,
} from '@dongchimi/design-system/icons';

import * as S from '../TodaySpecialRegistrationPage.css';

interface RegistrationTitleSectionProps {
  canCancelCurrentDraft: boolean;
  currentIndex: number;
  onCancelCurrentDraft: () => void;
  onNextProduct: () => void;
  onPreviousProduct: () => void;
  productCount: number;
}

export const RegistrationTitleSection = ({
  canCancelCurrentDraft,
  currentIndex,
  onCancelCurrentDraft,
  onNextProduct,
  onPreviousProduct,
  productCount,
}: RegistrationTitleSectionProps) => {
  const shouldShowProductControls = productCount > 1;

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
                disabled={currentIndex === 0}
                icon={<IcChevronLeft />}
                onClick={onPreviousProduct}
                type='button'
                variant='ghost'
              />
              <IconButton
                aria-label='다음 상품'
                className={S.titleNavigationButtonClassName}
                color='assistive'
                disabled={currentIndex === productCount - 1}
                icon={<IcChevronRight />}
                onClick={onNextProduct}
                type='button'
                variant='ghost'
              />
            </div>
          )}
        </div>

        {canCancelCurrentDraft && (
          <IconButton
            aria-label='현재 상품 등록 취소'
            className={S.titleRemoveButtonClassName}
            color='assistive'
            icon={<IcLineHorizontalSizeSmall />}
            onClick={onCancelCurrentDraft}
            type='button'
            variant='outlined'
          />
        )}
      </div>
    </header>
  );
};
