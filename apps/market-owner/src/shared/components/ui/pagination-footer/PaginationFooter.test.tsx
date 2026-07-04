import type { ComponentProps } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../../test';
import { PaginationFooter } from './PaginationFooter';

const renderFooter = (props: Partial<ComponentProps<typeof PaginationFooter>> = {}) => {
  return render(
    <PaginationFooter
      currentPage={2}
      pageSize={10}
      pages={[1, 2, 3]}
      rangeEnd={10}
      rangeStart={1}
      totalCount={128}
      {...props}
    />,
  );
};

describe('PaginationFooter', () => {
  it('renders total count, visible range, page size, and current page state', () => {
    renderFooter();

    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('1-10')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2 페이지, 현재 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('calls page change handlers for previous, next, and page buttons', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    renderFooter({ onPageChange: handlePageChange });

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));
    await user.click(screen.getByRole('button', { name: '다음 페이지' }));
    await user.click(screen.getByRole('button', { name: '3 페이지' }));

    expect(handlePageChange).toHaveBeenNthCalledWith(1, 1);
    expect(handlePageChange).toHaveBeenNthCalledWith(2, 3);
    expect(handlePageChange).toHaveBeenNthCalledWith(3, 3);
  });

  it('disables boundary navigation by default', () => {
    renderFooter({ currentPage: 1 });

    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeEnabled();
  });

  it('renders page size as a button only when callback is provided', async () => {
    const handlePageSizeClick = vi.fn();
    const user = userEvent.setup();

    const { rerender } = renderFooter();

    expect(
      screen.queryByRole('button', { name: '페이지당 표시 개수 선택: 10' }),
    ).not.toBeInTheDocument();

    rerender(
      <PaginationFooter
        currentPage={2}
        onPageSizeClick={handlePageSizeClick}
        pageSize={10}
        pages={[1, 2, 3]}
        rangeEnd={10}
        rangeStart={1}
        totalCount={128}
      />,
    );

    await user.click(screen.getByRole('button', { name: '페이지당 표시 개수 선택: 10' }));

    expect(handlePageSizeClick).toHaveBeenCalledOnce();
  });
});
