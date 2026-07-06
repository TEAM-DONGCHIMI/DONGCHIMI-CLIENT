import { lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router';
import type { RouteObject } from 'react-router';

import { AsyncBoundary } from '@/app/boundaries';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { NoSidebarLayout } from '@/app/layouts/NoSidebarLayout';
import { SidebarLayout } from '@/app/layouts/SidebarLayout';
import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

const createLazyRoute = <ModuleTypes, ExportNameTypes extends keyof ModuleTypes>(
  importer: () => Promise<ModuleTypes>,
  exportName: ExportNameTypes,
) => {
  const LazyRouteComponent = lazy(async () => {
    const routeModule = await importer();

    return {
      default: routeModule[exportName] as ComponentType,
    };
  });

  return {
    Component: function BoundariedLazyRouteComponent() {
      return (
        <AsyncBoundary>
          <LazyRouteComponent />
        </AsyncBoundary>
      );
    },
  };
};

export const marketOwnerRoutes = [
  {
    Component: AuthLayout,
    children: [
      {
        path: MARKET_OWNER_ROUTES.login,
        ...createLazyRoute(() => import('@/domains/auth/login/LoginPage'), 'LoginPage'),
      },
      {
        path: MARKET_OWNER_ROUTES.signup,
        ...createLazyRoute(() => import('@/domains/auth/signup/SignupPage'), 'SignupPage'),
      },
    ],
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: SidebarLayout,
        children: [
          {
            path: MARKET_OWNER_ROUTES.home,
            ...createLazyRoute(() => import('@/domains/home/overview/HomePage'), 'HomePage'),
          },
          {
            path: MARKET_OWNER_ROUTES.todaySpecialRegistration,
            ...createLazyRoute(
              () =>
                import('@/domains/product/today-special-registration/TodaySpecialRegistrationPage'),
              'TodaySpecialRegistrationPage',
            ),
          },
          {
            path: MARKET_OWNER_ROUTES.eventDiscountRegistration,
            ...createLazyRoute(
              () =>
                import('@/domains/product/event-discount-registration/EventDiscountRegistrationPage'),
              'EventDiscountRegistrationPage',
            ),
          },
          {
            path: MARKET_OWNER_ROUTES.todaySpecialEdit,
            ...createLazyRoute(
              () => import('@/domains/product/today-special-edit/TodaySpecialEditPage'),
              'TodaySpecialEditPage',
            ),
          },
          {
            path: MARKET_OWNER_ROUTES.eventDiscountEdit,
            ...createLazyRoute(
              () => import('@/domains/product/event-discount-edit/EventDiscountEditPage'),
              'EventDiscountEditPage',
            ),
          },
          {
            path: MARKET_OWNER_ROUTES.leafletShare,
            ...createLazyRoute(
              () => import('@/domains/leaflet/share/LeafletSharePage'),
              'LeafletSharePage',
            ),
          },
        ],
      },
      {
        Component: NoSidebarLayout,
        children: [
          {
            path: MARKET_OWNER_ROUTES.registrationResult,
            ...createLazyRoute(
              () => import('@/domains/product/registration-result/RegistrationResultPage'),
              'RegistrationResultPage',
            ),
          },
        ],
      },
    ],
  },
  {
    path: MARKET_OWNER_ROUTES.notFound,
    ...createLazyRoute(() => import('@/domains/not-found/fallback/NotFoundPage'), 'NotFoundPage'),
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(marketOwnerRoutes);
