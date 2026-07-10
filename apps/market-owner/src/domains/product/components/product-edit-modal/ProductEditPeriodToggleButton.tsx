import { Button } from '@dongchimi/design-system/components';
import { IcCalendarPlusSizeSmall, IcLineHorizontalSizeSmall } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './ProductEditPeriodToggleButton.css';

interface ProductEditPeriodToggleButtonProps {
  className?: string;
  isTodayOnly: boolean;
  onClick: () => void;
}

export const ProductEditPeriodToggleButton = ({
  className,
  isTodayOnly,
  onClick,
}: ProductEditPeriodToggleButtonProps) => {
  return (
    <Button
      className={cn(S.buttonClassName, className)}
      color='assistive'
      rightIcon={
        isTodayOnly ? <IcCalendarPlusSizeSmall aria-hidden='true' /> : <IcLineHorizontalSizeSmall />
      }
      size='small'
      type='button'
      variant='outlined'
      onClick={onClick}
    >
      {isTodayOnly ? '하루 더 늘리기' : '오늘만 특가로'}
    </Button>
  );
};
