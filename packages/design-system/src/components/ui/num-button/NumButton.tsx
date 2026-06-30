import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { numButton } from './NumButton.css';

type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'color'>;

export interface NumButtonProps extends NativeButtonProps {
  children: ReactNode;
  selected?: boolean;
}

export const NumButton = forwardRef<HTMLButtonElement, NumButtonProps>(
  ({ children, className, selected = false, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-pressed={selected}
        className={cn(numButton({ selected }), className)}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  },
);

NumButton.displayName = 'NumButton';
