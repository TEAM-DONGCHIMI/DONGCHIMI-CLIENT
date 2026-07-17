import { act, render, screen } from '@/test';
import { RouterProvider, createMemoryRouter, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

import { ProtectedRoute } from './ProtectedRoute';

const LoginRoute = () => {
  const location = useLocation();
  const state = location.state as { from?: string } | null;

  return (
    <>
      <h1>로그인</h1>
      <span>{state?.from}</span>
    </>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  afterEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('redirects to login with the current location after the auth session is cleared', async () => {
    const protectedLocation = `${MARKET_OWNER_ROUTES.eventDiscountEdit}?page=2#product-list`;
    const router = createMemoryRouter(
      [
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <h1>행사 할인 상품 수정</h1>,
              path: MARKET_OWNER_ROUTES.eventDiscountEdit,
            },
          ],
        },
        {
          element: <LoginRoute />,
          path: MARKET_OWNER_ROUTES.login,
        },
      ],
      {
        initialEntries: [protectedLocation],
      },
    );

    useAuthStore.getState().setAccessToken('active-access-token');
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: '행사 할인 상품 수정' })).toBeVisible();

    act(() => {
      useAuthStore.getState().clearSession();
    });

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeVisible();
    expect(screen.getByText(protectedLocation)).toBeVisible();
  });
});
