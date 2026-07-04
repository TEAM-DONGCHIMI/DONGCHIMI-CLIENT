import { type ComponentPropsWithoutRef } from 'react';

export type PeriodProductCardProps = ComponentPropsWithoutRef<'div'>;

export const PeriodProductCard = ({ children, ...props }: PeriodProductCardProps) => {
  return <div {...props}>{children}</div>;
};
