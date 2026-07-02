import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { dropdown } from './Dropdown.css';

export interface DropdownProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(dropdown, className)} {...props}>
        {children}
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
