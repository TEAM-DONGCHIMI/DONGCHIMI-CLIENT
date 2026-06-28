import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { iconButton, iconButtonIcon } from './IconButton.css';

type IconButtonAccessibleNameProps =
  | {
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      'aria-label'?: never;
      'aria-labelledby': string;
    };

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-label' | 'aria-labelledby' | 'children' | 'color'
>;

type IconButtonVariantProps = RecipeVariantProps<typeof iconButton>;

export interface IconButtonOwnProps extends IconButtonVariantProps {
  icon: ReactNode;
}

export type IconButtonProps = NativeButtonProps &
  IconButtonAccessibleNameProps &
  IconButtonOwnProps;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      color = 'primary',
      icon,
      size = 'large',
      type = 'button',
      variant = 'solid',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(iconButton({ color, size, variant }), className)}
        type={type}
        {...props}
      >
        <span aria-hidden='true' className={iconButtonIcon}>
          {icon}
        </span>
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
