import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../styles/class-name';
import { lineButton } from './LineButton.css';

export type LineButtonProps = ComponentPropsWithoutRef<'button'>;

export const LineButton = forwardRef<HTMLButtonElement, LineButtonProps>(
  ({ children, className, type = 'button', ...props }, ref) => {
    return (
      <button ref={ref} className={cn(lineButton, className)} type={type} {...props}>
        {children}
      </button>
    );
  },
);

LineButton.displayName = 'LineButton';
