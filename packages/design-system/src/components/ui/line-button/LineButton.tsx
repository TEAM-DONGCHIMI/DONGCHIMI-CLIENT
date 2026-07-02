import { type ComponentPropsWithoutRef } from 'react';

export type LineButtonProps = ComponentPropsWithoutRef<'div'>;

export const LineButton = ({ children, ...props }: LineButtonProps) => {
  return <div {...props}>{children}</div>;
};
