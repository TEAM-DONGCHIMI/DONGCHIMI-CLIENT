import { Navigate, Outlet, useLocation } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

export const ProtectedRoute = () => {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const bootstrapStatus = useAuthStore((state) => state.bootstrapStatus);

  if (bootstrapStatus === 'idle' || bootstrapStatus === 'refreshing') {
    return null;
  }

  if (!accessToken || bootstrapStatus === 'unauthenticated') {
    const from = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate replace state={{ from }} to={MARKET_OWNER_ROUTES.login} />;
  }

  return <Outlet />;
};
