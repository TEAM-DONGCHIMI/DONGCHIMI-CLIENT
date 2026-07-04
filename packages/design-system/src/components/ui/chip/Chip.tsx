import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { chip, chipIcon, chipText } from './Chip.css';

type NativeSpanProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

type DefaultChipSizeTypes = 'desktop' | 'mobile' | 'mobileLarge';
type SaleChipSizeTypes = 'pointDesktop' | 'pointMobile';

type ChipVariantProps =
  | { kind?: 'default'; variant?: 'subtle'; color?: 'neutral'; size?: DefaultChipSizeTypes }
  | { kind?: 'default'; variant: 'soft'; color?: 'primary'; size?: DefaultChipSizeTypes }
  | {
      kind?: 'default';
      variant: 'solid';
      color: 'primary' | 'negative' | 'dark';
      size?: DefaultChipSizeTypes;
    }
  | { kind: 'status'; variant?: never; color: 'negative' | 'primary'; size?: 'status' }
  | { kind: 'sale'; variant?: never; color?: never; size: SaleChipSizeTypes };

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
} as const;

const statusVariantByColor = {
  negative: 'outlined',
  primary: 'soft',
} as const;

interface ChipVisualProps {
  variant: 'solid' | 'soft' | 'subtle' | 'outlined' | 'point';
  color?: 'neutral' | 'primary' | 'negative' | 'dark';
  size: DefaultChipSizeTypes | 'status' | SaleChipSizeTypes;
}

const resolveChipVisualProps = (props: ChipVariantProps): ChipVisualProps => {
  if (props.kind === 'sale') {
    return { variant: 'point', size: props.size };
  }

  if (props.kind === 'status') {
    return {
      variant: statusVariantByColor[props.color],
      color: props.color,
      size: props.size ?? 'status',
    };
  }

  const variant = props.variant ?? 'subtle';

  return {
    variant,
    color: props.color ?? defaultColorByVariant[variant as keyof typeof defaultColorByVariant],
    size: props.size ?? 'desktop',
  };
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    { children, className, color, kind, leftIcon, rounded = true, size, variant, ...nativeProps },
    ref,
  ) => {
    const hasLeftIcon = hasRenderableIcon(leftIcon);
    const visual = resolveChipVisualProps({ color, kind, size, variant } as ChipVariantProps);

    return (
      <span
        ref={ref}
        className={cn(
          chip({ color: visual.color, rounded, size: visual.size, variant: visual.variant }),
          className,
        )}
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

Chip.displayName = 'Chip';
