import { createBrowserRouter } from 'react-router';
import type { RouteObject } from 'react-router';

import { HomePage } from '../pages/home/HomePage';
import { NotFoundPage } from '../pages/not-found/NotFoundPage';
import { MARKET_OWNER_ROUTES } from '../shared/constants/routes';

export const marketOwnerRoutes = [
  {
    path: MARKET_OWNER_ROUTES.home,
    Component: HomePage,
  },
  {
    path: MARKET_OWNER_ROUTES.notFound,
    Component: NotFoundPage,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(marketOwnerRoutes);
