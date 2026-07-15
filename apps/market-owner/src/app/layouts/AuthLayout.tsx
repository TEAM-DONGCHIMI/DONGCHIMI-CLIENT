import { Outlet, useLocation } from 'react-router';
import { ToastProvider } from '@dongchimi/shared/toast';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import onboardingImageUrl from '@/shared/assets/images/img_onboarding.svg';

import * as S from './AuthLayout.css';

export const AuthLayout = () => {
  const { pathname } = useLocation();
  const isLoginRoute = pathname === MARKET_OWNER_ROUTES.login;

  return (
    <div className={S.authLayoutRootClassName}>
      {isLoginRoute && (
        <div aria-hidden='true' className={S.onboardingPanelClassName}>
          <img alt='' className={S.onboardingImageClassName} src={onboardingImageUrl} />
        </div>
      )}
      <div className={S.authLayoutContentWrapperClassName}>
        <div className={S.authLayoutContentClassName}>
          <ToastProvider offset='2.4rem' placement='top-center'>
            <Outlet />
          </ToastProvider>
        </div>
      </div>
    </div>
  );
};
