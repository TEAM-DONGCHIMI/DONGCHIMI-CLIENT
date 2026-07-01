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

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

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
    const hasLeftIcon = hasRenderableIcon(leftIcon);

    return (
      <button
        ref={ref}
        className={cn(listButton({ color, hasLeftIcon, selected }), className)}
        {...props}
        aria-pressed={selected}
        type={type}
      >
        {hasLeftIcon ? (
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
