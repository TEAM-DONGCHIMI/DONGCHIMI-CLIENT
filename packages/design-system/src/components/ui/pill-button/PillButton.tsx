import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { pillButton, pillButtonIcon } from './PillButton.css';

type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'color'>;

type PillButtonVariantProps = RecipeVariantProps<typeof pillButton>;
type PillButtonVariantTypes = NonNullable<PillButtonVariantProps['variant']>;

// mobile은 Figma에 outlined 조합이 없어 outlined-light / filled만 허용합니다.
type PillButtonPlatformVariantProps =
  | { platform?: 'desktop'; variant?: PillButtonVariantTypes }
  | { platform: 'mobile'; variant?: Exclude<PillButtonVariantTypes, 'outlined'> };

export type PillButtonProps = NativeButtonProps &
  PillButtonPlatformVariantProps & {
    children: ReactNode;
    icon?: ReactNode;
  };

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      children,
      className,
      icon,
      platform = 'desktop',
      type = 'button',
      variant = 'outlined-light',
      ...props
    },
    ref,
  ) => {
    const hasRenderableIcon = icon != null && icon !== false && icon !== '';

    return (
      <button
        ref={ref}
        className={cn(pillButton({ platform, variant }), className)}
        type={type}
        {...props}
      >
        {children}
        {hasRenderableIcon && (
          <span aria-hidden='true' className={pillButtonIcon({ platform })}>
            {icon}
          </span>
        )}
      </button>
    );
  },
);

PillButton.displayName = 'PillButton';
