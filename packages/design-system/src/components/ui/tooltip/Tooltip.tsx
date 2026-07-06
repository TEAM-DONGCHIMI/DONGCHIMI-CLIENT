import { type ComponentPropsWithRef } from 'react';

import { cn } from '../../../styles/class-name';
import * as S from './Tooltip.css';

type TooltipSpaceTypes = 'top' | 'bottom';

type NativeTooltipProps = Omit<ComponentPropsWithRef<'div'>, 'children'>;

export interface TooltipProps extends NativeTooltipProps {
  children: string;
  space?: TooltipSpaceTypes;
}

const TooltipArrow = ({ space }: { space: TooltipSpaceTypes }) => (
  <svg aria-hidden='true' className={S.tooltipArrow[space]} viewBox='0 0 20 8'>
    <path d='M10 0L20 8L0 8Z' fill='currentColor' />
  </svg>
);

export const Tooltip = ({
  children,
  className,
  ref,
  role,
  space = 'top',
  ...props
}: TooltipProps) => {
  return (
    <div ref={ref} className={cn(S.tooltip, className)} role={role ?? 'tooltip'} {...props}>
      {space === 'top' ? <TooltipArrow space='top' /> : null}
      <div className={S.tooltipBubble}>
        <span className={S.tooltipLabel}>{children}</span>
      </div>
      {space === 'bottom' ? <TooltipArrow space='bottom' /> : null}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
