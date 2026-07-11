import { type ComponentPropsWithRef } from 'react';

import { cn } from '../../../styles/class-name';
import { Tooltip } from '../tooltip';
import * as S from './RequiredMark.css';

type NativeRequiredMarkProps = Omit<ComponentPropsWithRef<'span'>, 'children'>;

export type RequiredMarkProps = NativeRequiredMarkProps;

const requiredMarkTooltipMessage = '* 표시는 필수로 입력해야 해요.';

export const RequiredMark = ({ className, ref, ...props }: RequiredMarkProps) => {
  return (
    <span ref={ref} className={cn(S.rootClassName, className)} {...props}>
      <span aria-hidden='true' className={S.markClassName}>
        *
      </span>
      <Tooltip className={S.tooltipClassName} space='bottom'>
        {requiredMarkTooltipMessage}
      </Tooltip>
    </span>
  );
};
