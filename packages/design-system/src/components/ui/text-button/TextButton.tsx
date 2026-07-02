import { type ComponentPropsWithoutRef } from 'react';

export type TextButtonProps = ComponentPropsWithoutRef<'div'>;

export const TextButton = ({ children, ...props }: TextButtonProps) => {
  return <div {...props}>{children}</div>;
};
