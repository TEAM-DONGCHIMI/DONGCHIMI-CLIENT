import { createBrowserRouter } from 'react-router';
import type { RouteObject } from 'react-router';

import { createLazyRoute } from '@/app/create-lazy-route';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { NoSidebarLayout } from '@/app/layouts/NoSidebarLayout';
import { SidebarLayout } from '@/app/layouts/SidebarLayout';
import { GuestOnlyRoute } from '@/app/routes/GuestOnlyRoute';
import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const marketOwnerRoutes = [
  {
    Component: GuestOnlyRoute,
    children: [
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
            path: MARKET_OWNER_ROUTES.marketInformationRegistration,
            ...createLazyRoute(
              () =>
                import('@/domains/market/information-registration/MarketInformationRegistrationPage'),
              'MarketInformationRegistrationPage',
            ),
          },
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
