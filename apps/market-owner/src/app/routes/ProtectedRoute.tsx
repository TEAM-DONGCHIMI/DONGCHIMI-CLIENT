import { Navigate, Outlet, useLocation } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

const ENABLE_AUTH_GUARD = false;

const hasMarketOwnerSession = () => {
  return true;
};

export const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = !ENABLE_AUTH_GUARD || hasMarketOwnerSession();

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate replace state={{ from }} to={MARKET_OWNER_ROUTES.login} />;
  }

  return <Outlet />;
};
