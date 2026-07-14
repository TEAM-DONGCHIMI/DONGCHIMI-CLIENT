import { Navigate, Outlet } from 'react-router';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

export const GuestOnlyRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const bootstrapStatus = useAuthStore((state) => state.bootstrapStatus);

  if (bootstrapStatus === 'idle' || bootstrapStatus === 'refreshing') {
    return null;
  }

  if (accessToken && bootstrapStatus === 'authenticated') {
    return <Navigate replace to={MARKET_OWNER_ROUTES.home} />;
  }

  return <Outlet />;
};
