import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './LoginCardLayout.css';

export type LoginCardLayoutProps = ComponentPropsWithoutRef<'section'>;

const TITLE_ID = 'market-owner-login-title';

export const LoginCardLayout = ({
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  ...props
}: LoginCardLayoutProps) => (
  <section
    aria-labelledby={ariaLabelledBy ?? TITLE_ID}
    className={cn(S.rootClassName, className)}
    {...props}
  >
    <div className={S.headerClassName}>
      <div aria-hidden='true' className={S.logoSlotClassName} />
      <h1 className={S.titleClassName} id={TITLE_ID}>
        마트 관리자 로그인
      </h1>
    </div>
    {children}
  </section>
);
