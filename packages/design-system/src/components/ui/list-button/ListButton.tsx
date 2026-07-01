import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import { listButton, listButtonIcon, listButtonLabel } from './ListButton.css';

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-pressed' | 'children' | 'color'
>;

type ListButtonVariantProps = RecipeVariantProps<typeof listButton>;
type ListButtonPublicVariantProps = Omit<ListButtonVariantProps, 'hasLeftIcon'>;

export interface ListButtonProps extends NativeButtonProps, ListButtonPublicVariantProps {
  children: ReactNode;
  leftIcon?: ReactNode;
}

export const ListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
  (
    {
      children,
      className,
      color = 'assistive',
      leftIcon,
      selected = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          listButton({ color, hasLeftIcon: leftIcon !== undefined, selected }),
          className,
        )}
        {...props}
        aria-pressed={selected}
        type={type}
      >
        {leftIcon !== undefined ? (
          <span aria-hidden='true' className={listButtonIcon}>
            {selected ? leftIcon : null}
          </span>
        ) : null}
        <span className={listButtonLabel}>{children}</span>
      </button>
    );
  },
);

ListButton.displayName = 'ListButton';
