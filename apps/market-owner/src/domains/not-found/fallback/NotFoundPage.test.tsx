import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { render, screen, userEvent } from '@/test';

import { NotFoundPage } from './NotFoundPage';

const renderNotFoundPage = () => {
  const router = createMemoryRouter(
    [
      {
        path: MARKET_OWNER_ROUTES.home,
        element: <h1>사장님 홈</h1>,
      },
      {
        path: MARKET_OWNER_ROUTES.notFound,
        element: <NotFoundPage />,
      },
    ],
    {
      initialEntries: ['/존재하지-않는-경로'],
    },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe('NotFoundPage', () => {
  it('renders the 404 fallback for an unknown route', () => {
    renderNotFoundPage();

    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '메인으로 가기' })).toBeInTheDocument();
  });

  it('routes to the market owner home when the action is clicked', async () => {
    const user = userEvent.setup();
    const router = renderNotFoundPage();

    await user.click(screen.getByRole('button', { name: '메인으로 가기' }));

    expect(await screen.findByRole('heading', { name: '사장님 홈' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.home);
  });
});
