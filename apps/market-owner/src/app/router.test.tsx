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
  it('renders public auth routes without the sidebar layout', () => {
    renderRoute('/login');

    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('renders protected work routes with the sidebar layout', () => {
    renderRoute('/');

    expect(screen.getByRole('heading', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps the registration result route outside the sidebar layout', () => {
    renderRoute('/products/registration-result');

    expect(screen.getByRole('heading', { name: '상품 등록 결과 확인' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('syncs edit sidebar and tab navigation through route state', () => {
    renderRoute('/products/event-discount/edit');

    expect(screen.getByRole('heading', { name: '행사 할인 상품 수정' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인 상품 수정' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('navigation', { name: '상품 수정 유형' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '행사 할인' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the not found page for unknown routes', () => {
    renderRoute('/unknown-route');

    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다.' })).toBeInTheDocument();
  });
});
