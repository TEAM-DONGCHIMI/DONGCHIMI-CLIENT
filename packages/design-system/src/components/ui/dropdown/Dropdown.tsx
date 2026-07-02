import { type ComponentPropsWithoutRef } from 'react';

export type DropdownProps = ComponentPropsWithoutRef<'div'>;

export const Dropdown = ({ children, ...props }: DropdownProps) => {
  return <div {...props}>{children}</div>;
};
