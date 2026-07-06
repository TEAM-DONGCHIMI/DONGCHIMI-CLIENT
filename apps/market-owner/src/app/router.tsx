import { createBrowserRouter } from 'react-router';
import type { RouteObject } from 'react-router';

import { AuthLayout } from '@/app/layouts/AuthLayout';
import { NoSidebarLayout } from '@/app/layouts/NoSidebarLayout';
import { SidebarLayout } from '@/app/layouts/SidebarLayout';
import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { LoginPage } from '@/domains/auth/login/LoginPage';
import { SignupPage } from '@/domains/auth/signup/SignupPage';
import { HomePage } from '@/domains/home/overview/HomePage';
import { LeafletSharePage } from '@/domains/leaflet/share/LeafletSharePage';
import { NotFoundPage } from '@/domains/not-found/fallback/NotFoundPage';
import { EventDiscountEditPage } from '@/domains/product/event-discount-edit/EventDiscountEditPage';
import { EventDiscountRegistrationPage } from '@/domains/product/event-discount-registration/EventDiscountRegistrationPage';
import { RegistrationResultPage } from '@/domains/product/registration-result/RegistrationResultPage';
import { TodaySpecialEditPage } from '@/domains/product/today-special-edit/TodaySpecialEditPage';
import { TodaySpecialRegistrationPage } from '@/domains/product/today-special-registration/TodaySpecialRegistrationPage';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';

export const marketOwnerRoutes = [
  {
    Component: AuthLayout,
    children: [
      {
        path: MARKET_OWNER_ROUTES.login,
        Component: LoginPage,
      },
      {
        path: MARKET_OWNER_ROUTES.signup,
        Component: SignupPage,
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
            Component: HomePage,
          },
          {
            path: MARKET_OWNER_ROUTES.todaySpecialRegistration,
            Component: TodaySpecialRegistrationPage,
          },
          {
            path: MARKET_OWNER_ROUTES.eventDiscountRegistration,
            Component: EventDiscountRegistrationPage,
          },
          {
            path: MARKET_OWNER_ROUTES.todaySpecialEdit,
            Component: TodaySpecialEditPage,
          },
          {
            path: MARKET_OWNER_ROUTES.eventDiscountEdit,
            Component: EventDiscountEditPage,
          },
          {
            path: MARKET_OWNER_ROUTES.leafletShare,
            Component: LeafletSharePage,
          },
        ],
      },
      {
        Component: NoSidebarLayout,
        children: [
          {
            path: MARKET_OWNER_ROUTES.registrationResult,
            Component: RegistrationResultPage,
          },
        ],
      },
    ],
  },
  {
    path: MARKET_OWNER_ROUTES.notFound,
    Component: NotFoundPage,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(marketOwnerRoutes);
