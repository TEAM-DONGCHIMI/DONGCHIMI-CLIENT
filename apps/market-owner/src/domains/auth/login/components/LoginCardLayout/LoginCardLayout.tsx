import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './LoginCardLayout.css';

export type LoginCardLayoutProps = ComponentPropsWithoutRef<'section'>;

export const LoginCardLayout = ({ children, className, ...props }: LoginCardLayoutProps) => (
  <section className={cn(S.rootClassName, className)} {...props}>
    {children}
  </section>
);
