import { type ComponentPropsWithoutRef } from 'react';

export type ChipProps = ComponentPropsWithoutRef<'div'>;

export const Chip = ({ children, ...props }: ChipProps) => {
  return <div {...props}>{children}</div>;
};
