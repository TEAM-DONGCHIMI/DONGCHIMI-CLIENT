import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { chip, chipIcon, chipText } from './Chip.css';

export type NativeSpanProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

export interface ChipBaseProps extends NativeSpanProps {
  children: ReactNode;
  color?: 'neutral' | 'primary' | 'negative' | 'dark';
  leftIcon?: ReactNode;
  rounded?: boolean;
  size: 'desktop' | 'mobile' | 'mobileLarge' | 'status' | 'pointDesktop' | 'pointMobile';
  variant: 'solid' | 'soft' | 'subtle' | 'outlined' | 'point';
}

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

export const ChipBase = forwardRef<HTMLSpanElement, ChipBaseProps>(
  (
    { children, className, color, leftIcon, rounded = true, size, variant, ...nativeProps },
    ref,
  ) => {
    const hasLeftIcon = hasRenderableIcon(leftIcon);

    return (
      <span
        ref={ref}
        className={cn(chip({ color, rounded, size, variant }), className)}
        {...nativeProps}
      >
        {hasLeftIcon ? (
          <span aria-hidden='true' className={chipIcon}>
            {leftIcon}
          </span>
        ) : null}
        <span className={chipText}>{children}</span>
      </span>
    );
  },
);

ChipBase.displayName = 'ChipBase';
