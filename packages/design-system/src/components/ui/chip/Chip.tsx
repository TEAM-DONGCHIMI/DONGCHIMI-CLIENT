import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { chip, chipIcon, chipText } from './Chip.css';

type NativeSpanProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

type ChipSizeTypes = 'desktop' | 'mobile' | 'mobileLarge' | 'status';
type PointChipSizeTypes = 'pointDesktop' | 'pointMobile';

type ChipVariantProps =
  | { variant?: 'subtle'; color?: 'neutral'; size?: ChipSizeTypes }
  | { variant: 'soft'; color?: 'primary'; size?: ChipSizeTypes }
  | { variant: 'solid'; color: 'primary' | 'negative' | 'dark'; size?: ChipSizeTypes }
  | { variant: 'outlined'; color?: 'negative'; size?: ChipSizeTypes }
  | { variant: 'point'; color?: never; size: PointChipSizeTypes };

export type ChipProps = NativeSpanProps &
  ChipVariantProps & {
    children: ReactNode;
    leftIcon?: ReactNode;
    rounded?: boolean;
  };

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

const defaultColorByVariant = {
  subtle: 'neutral',
  soft: 'primary',
  outlined: 'negative',
} as const;

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    { children, className, color, leftIcon, rounded = true, size, variant = 'subtle', ...props },
    ref,
  ) => {
    const hasLeftIcon = hasRenderableIcon(leftIcon);
    const resolvedColor =
      variant === 'point'
        ? undefined
        : (color ?? defaultColorByVariant[variant as keyof typeof defaultColorByVariant]);
    const resolvedSize = size ?? (variant === 'point' ? 'pointDesktop' : 'desktop');

    return (
      <span
        ref={ref}
        className={cn(
          chip({ color: resolvedColor, rounded, size: resolvedSize, variant }),
          className,
        )}
        {...props}
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

Chip.displayName = 'Chip';
