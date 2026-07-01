import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { numButton } from './NumButton.css';

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-pressed' | 'children' | 'color'
>;

export interface NumButtonProps extends NativeButtonProps {
  children: ReactNode;
  selected?: boolean;
}

export const NumButton = forwardRef<HTMLButtonElement, NumButtonProps>(
  ({ children, className, selected = false, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(numButton({ selected }), className)}
        {...props}
        aria-pressed={selected}
        type={type}
      >
        {children}
      </button>
    );
  },
);

NumButton.displayName = 'NumButton';
