import { Outlet, useLocation } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

import * as S from './AuthLayout.css';

export const AuthLayout = () => {
  const { pathname } = useLocation();
  const isLoginRoute = pathname === MARKET_OWNER_ROUTES.login;

  return (
    <div className={S.authLayoutRootClassName}>
      {isLoginRoute && <div aria-hidden='true' className={S.onboardingPanelClassName} />}
      <div className={S.authLayoutContentWrapperClassName}>
        <div className={S.authLayoutContentClassName}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
