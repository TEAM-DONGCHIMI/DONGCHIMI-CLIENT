import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { pillButton, pillButtonIcon } from './PillButton.css';

type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'color'>;

type PillButtonVariantProps = RecipeVariantProps<typeof pillButton>;

export interface PillButtonOwnProps extends PillButtonVariantProps {
  children: ReactNode;
  icon?: ReactNode;
}

export type PillButtonProps = NativeButtonProps & PillButtonOwnProps;

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
    return (
      <button
        ref={ref}
        className={cn(pillButton({ platform, variant }), className)}
        type={type}
        {...props}
      >
        {children}
        {icon != null && (
          <span aria-hidden='true' className={pillButtonIcon({ platform })}>
            {icon}
          </span>
        )}
      </button>
    );
  },
);

PillButton.displayName = 'PillButton';
