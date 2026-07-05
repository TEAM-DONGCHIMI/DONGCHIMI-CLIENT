import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import type { RecipeVariantProps } from '../../../styles/recipe';
import {
  listButton,
  listButtonCheckbox,
  listButtonCheckIcon,
  listButtonIcon,
  listButtonLabel,
} from './ListButton.css';

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-checked' | 'aria-pressed' | 'children' | 'color' | 'role'
>;

type ListButtonVariantProps = RecipeVariantProps<typeof listButton>;
type ListButtonPublicVariantProps = Omit<ListButtonVariantProps, 'hasLeadingVisual'>;

type ListButtonLeadingProps =
  | { checkbox?: false; leftIcon?: ReactNode }
  | { checkbox: boolean; leftIcon?: never };

export type ListButtonProps = NativeButtonProps &
  ListButtonPublicVariantProps &
  ListButtonLeadingProps & {
    children: ReactNode;
  };

const hasRenderableIcon = (icon: ReactNode) => {
  return icon != null && icon !== false;
};

const CheckboxCheckIcon = () => (
  <svg
    aria-hidden='true'
    className={listButtonCheckIcon}
    fill='none'
    viewBox='0 0 18 18'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14.0562 5.45136C14.3146 5.71985 14.3146 6.15515 14.0562 6.42364L7.43853 13.2986C7.18009 13.5671 6.76109 13.5671 6.50265 13.2986L3.19383 9.86114C2.93539 9.59265 2.93539 9.15735 3.19383 8.88886C3.45226 8.62038 3.87127 8.62038 4.1297 8.88886L6.97059 11.8402L13.1203 5.45136C13.3787 5.18288 13.7977 5.18288 14.0562 5.45136Z'
      fill='currentColor'
    />
  </svg>
);

const ListButtonCheckbox = ({ checked }: { checked: boolean }) => {
  return (
    <span aria-hidden='true' className={listButtonIcon}>
      <span className={listButtonCheckbox({ checked })}>
        {checked ? <CheckboxCheckIcon /> : null}
      </span>
    </span>
  );
};

export const ListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
  (
    {
      checkbox = false,
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
    const hasLeftIcon = !checkbox && hasRenderableIcon(leftIcon);
    const hasLeadingVisual = checkbox || hasLeftIcon;
    const ariaProps = checkbox
      ? { role: 'checkbox' as const, 'aria-checked': selected }
      : { 'aria-pressed': selected };

    return (
      <button
        ref={ref}
        className={cn(listButton({ color, hasLeadingVisual, selected }), className)}
        {...props}
        {...ariaProps}
        type={type}
      >
        {checkbox ? (
          <ListButtonCheckbox checked={selected} />
        ) : hasLeftIcon ? (
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
