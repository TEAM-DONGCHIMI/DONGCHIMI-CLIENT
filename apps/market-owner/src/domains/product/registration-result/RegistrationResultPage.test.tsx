import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { render, screen, userEvent, within } from '@/test';
import { RegistrationResultPage } from './RegistrationResultPage';

const renderPage = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/products/event-discount/new',
        element: <h1>등록 파일 분석</h1>,
      },
      {
        path: '/products/registration-result',
        element: <RegistrationResultPage />,
      },
    ],
    {
      initialEntries: ['/products/registration-result'],
    },
  );

  render(<RouterProvider router={router} />);
};

describe('RegistrationResultPage', () => {
  it('renders no-sidebar upload header and registration result section', () => {
    renderPage();

    const breadcrumb = screen.getByRole('navigation', { name: '현재 위치' });

    expect(breadcrumb).toBeInTheDocument();
    expect(screen.getByText('행사 할인 상품 등록')).toBeInTheDocument();
    expect(within(breadcrumb).getByText('상품 결과 등록 확인')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('heading', { name: '상품 결과 등록 확인' })).toBeInTheDocument();
  });

  it('routes to file analysis page when previous action is clicked', async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole('button', { name: '이전' }));

    expect(await screen.findByRole('heading', { name: '등록 파일 분석' })).toBeInTheDocument();
  });
});
