import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { render, screen } from '../test';
import { marketOwnerRoutes } from './router';

const renderRoute = (path: string) => {
  const router = createMemoryRouter(marketOwnerRoutes, {
    initialEntries: [path],
  });

  return render(<RouterProvider router={router} />);
};

describe('marketOwnerRoutes', () => {
  it('renders public auth routes without the sidebar layout', async () => {
    renderRoute('/login');

    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('renders protected work routes with the sidebar layout', async () => {
    renderRoute('/');

    expect(await screen.findByRole('heading', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: '오늘의 전단 공유' })).not.toBeInTheDocument();
  });

  it('keeps the registration result route outside the sidebar layout', async () => {
    renderRoute('/products/registration-result');

    expect(await screen.findByRole('heading', { name: '상품 결과 등록 확인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('syncs edit sidebar and tab navigation through route state', async () => {
    renderRoute('/products/event-discount/edit');

    expect(await screen.findByRole('heading', { name: '행사 할인 상품 수정' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인 상품 수정' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('navigation', { name: '상품 수정 유형' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the not found page for unknown routes', async () => {
    renderRoute('/unknown-route');

    expect(
      await screen.findByRole('heading', { name: '페이지를 찾을 수 없습니다.' }),
    ).toBeInTheDocument();
  });
});
