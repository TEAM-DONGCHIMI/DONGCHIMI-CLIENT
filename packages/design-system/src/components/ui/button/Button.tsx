import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { button, buttonIcon } from './Button.css';

type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'color'>;

type ButtonVariantProps = RecipeVariantProps<typeof button>;

export interface ButtonProps extends NativeButtonProps, ButtonVariantProps {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      color = 'primary',
      leftIcon,
      rightIcon,
      size = 'small',
      type = 'button',
      variant = 'solid',
      ...props
    },
    ref,
  ) => {
    const canRenderIcon = size !== 'mobile';

    return (
      <button
        ref={ref}
        className={cn(button({ color, size, variant }), className)}
        type={type}
        {...props}
      >
        {canRenderIcon && leftIcon !== undefined ? (
          <span aria-hidden='true' className={buttonIcon}>
            {leftIcon}
          </span>
        ) : null}
        <span>{children}</span>
        {canRenderIcon && rightIcon !== undefined ? (
          <span aria-hidden='true' className={buttonIcon}>
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';
