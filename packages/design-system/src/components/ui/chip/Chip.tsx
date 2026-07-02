import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { chip, chipIcon, chipText } from './Chip.css';

type NativeSpanProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

type ChipVariantProps = RecipeVariantProps<typeof chip>;

export interface ChipProps extends NativeSpanProps, ChipVariantProps {
  children: ReactNode;
  leftIcon?: ReactNode;
}

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      className,
      color = 'neutral',
      leftIcon,
      rounded = true,
      size = 'desktop',
      variant = 'subtle',
      ...props
    },
    ref,
  ) => {
    const hasLeftIcon = hasRenderableIcon(leftIcon);

    return (
      <span ref={ref} className={cn(chip({ color, rounded, size, variant }), className)} {...props}>
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
