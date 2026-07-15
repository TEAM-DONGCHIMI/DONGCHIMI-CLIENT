import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { button, buttonIcon } from './Button.css';

type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'color'>;

type ButtonVariantProps = RecipeVariantProps<typeof button>;
type ButtonSizeTypes = NonNullable<ButtonVariantProps['size']>;
type ButtonColorTypes = NonNullable<ButtonVariantProps['color']>;
type ButtonVariantTypes = NonNullable<ButtonVariantProps['variant']>;

type ButtonPresetProps =
  | {
      color?: Extract<ButtonColorTypes, 'primary' | 'assistive' | 'negative'>;
      variant?: Extract<ButtonVariantTypes, 'solid'>;
    }
  | {
      color: Extract<ButtonColorTypes, 'assistive' | 'assistiveLight' | 'negative'>;
      variant: Extract<ButtonVariantTypes, 'outlined'>;
    }
  | {
      color?: Extract<ButtonColorTypes, 'primary'>;
      variant: Extract<ButtonVariantTypes, 'soft'>;
    };

type DesktopButtonProps = ButtonPresetProps & {
  size?: Exclude<ButtonSizeTypes, 'mobile'>;
};

interface MobileButtonProps {
  color?: Extract<ButtonColorTypes, 'primary'>;
  size: Extract<ButtonSizeTypes, 'mobile'>;
  variant?: Extract<ButtonVariantTypes, 'solid'>;
}

interface ButtonCommonProps extends NativeButtonProps {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export type ButtonProps = ButtonCommonProps & (DesktopButtonProps | MobileButtonProps);

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

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
    const hasLeftIcon = hasRenderableIcon(leftIcon);
    const hasRightIcon = hasRenderableIcon(rightIcon);

    return (
      <button
        ref={ref}
        className={cn(button({ color, size, variant }), className)}
        type={type}
        {...props}
      >
        {hasLeftIcon ? (
          <span aria-hidden='true' className={buttonIcon}>
            {leftIcon}
          </span>
        ) : null}
        <span>{children}</span>
        {hasRightIcon ? (
          <span aria-hidden='true' className={buttonIcon}>
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';
