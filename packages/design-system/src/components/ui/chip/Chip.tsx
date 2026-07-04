import { forwardRef, type ReactNode } from 'react';

import { ChipBase, type NativeSpanProps } from './ChipBase';

type ChipSizeTypes = 'desktop' | 'mobile' | 'mobileLarge';

type ChipVariantProps =
  | { color?: 'neutral'; variant?: 'subtle' }
  | { color: 'negative'; variant?: 'solid' }
  | { color: 'dark'; variant?: 'solid' }
  | { color: 'primary'; variant: 'soft' | 'solid' };

export type ChipProps = NativeSpanProps &
  ChipVariantProps & {
    children: ReactNode;
    rounded?: boolean;
    size?: ChipSizeTypes;
  };

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    { children, className, color, rounded = true, size = 'desktop', variant, ...nativeProps },
    ref,
  ) => {
    const resolvedColor = color ?? 'neutral';
    const resolvedVariant = variant ?? (resolvedColor === 'neutral' ? 'subtle' : 'solid');

    return (
      <ChipBase
        ref={ref}
        className={className}
        color={resolvedColor}
        rounded={rounded}
        size={size}
        variant={resolvedVariant}
        {...nativeProps}
      >
        {children}
      </ChipBase>
    );
  },
);

Chip.displayName = 'Chip';
