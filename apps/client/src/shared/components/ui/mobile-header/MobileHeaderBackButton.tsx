'use client';

import { IconButton, type IconButtonProps } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';

import { backButtonClassName } from './MobileHeader.css';

export type MobileHeaderBackButtonProps = Omit<
  IconButtonProps,
  'aria-label' | 'aria-labelledby' | 'children' | 'color' | 'variant' | 'size' | 'rounded'
> & {
  'aria-label': string;
};

export const MobileHeaderBackButton = ({
  'aria-label': ariaLabel,
  className,
  type = 'button',
  ...props
}: MobileHeaderBackButtonProps) => {
  return (
    <IconButton
      aria-label={ariaLabel}
      className={cn(backButtonClassName, className)}
      color='assistive'
      type={type}
      variant='ghost'
      {...props}
    />
  );
};

MobileHeaderBackButton.displayName = 'MobileHeader.BackButton';
