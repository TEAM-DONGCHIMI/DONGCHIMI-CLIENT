import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '../../../styles/class-name';
import { ListButton } from '../list-button';
import { dropdown } from './Dropdown.css';

export interface DropdownProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

const DropdownRoot = ({ children, className, ref, ...props }: DropdownProps) => {
  return (
    <div ref={ref} className={cn(dropdown, className)} {...props}>
      {children}
    </div>
  );
};

DropdownRoot.displayName = 'Dropdown';

export type DropdownItemProps = ComponentPropsWithRef<typeof ListButton>;

const DropdownItem = ({ ref, ...props }: DropdownItemProps) => {
  return <ListButton ref={ref} {...props} />;
};

DropdownItem.displayName = 'Dropdown.Item';

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
});
