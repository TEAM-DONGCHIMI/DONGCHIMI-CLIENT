import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../test';
import { Navigation } from './Navigation';

const pages = [1, 2, 3, 4, 5];

describe('Navigation', () => {
  it('renders page buttons and marks the current page', () => {
    render(<Navigation currentPage={3} pages={pages} />);

    const currentPageButton = screen.getByRole('button', { name: '3 페이지, 현재 페이지' });

    expect(screen.getByRole('navigation', { name: '페이지 탐색' })).toBeInTheDocument();
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    expect(currentPageButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onPageChange when page and arrow buttons are selected', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    render(<Navigation currentPage={3} onPageChange={handlePageChange} pages={pages} />);

    await user.click(screen.getByRole('button', { name: '2 페이지' }));
    await user.click(screen.getByRole('button', { name: '이전 페이지' }));
    await user.click(screen.getByRole('button', { name: '다음 페이지' }));

    expect(handlePageChange).toHaveBeenNthCalledWith(1, 2);
    expect(handlePageChange).toHaveBeenNthCalledWith(2, 2);
    expect(handlePageChange).toHaveBeenNthCalledWith(3, 4);
  });

  it('disables previous and next buttons at boundaries', () => {
    const { rerender } = render(<Navigation currentPage={1} pages={pages} />);

    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeEnabled();

    rerender(<Navigation currentPage={5} pages={pages} />);

    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();
  });

  it('allows callers to override boundary disabled state and labels', () => {
    render(
      <Navigation
        aria-label='상품 목록 페이지'
        currentPage={3}
        nextDisabled
        nextLabel='다음 상품 페이지'
        pages={pages}
        previousDisabled
        previousLabel='이전 상품 페이지'
      />,
    );

    expect(screen.getByRole('navigation', { name: '상품 목록 페이지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전 상품 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 상품 페이지' })).toBeDisabled();
  });
});
