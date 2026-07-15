import type { ComponentProps } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../../test';
import { PaginationFooter } from './PaginationFooter';

const renderFooter = (props: Partial<ComponentProps<typeof PaginationFooter>> = {}) => {
  return render(
    <PaginationFooter
      currentPage={2}
      pages={[1, 2, 3]}
      rangeEnd={10}
      rangeStart={1}
      totalCount={128}
      {...props}
    />,
  );
};

describe('PaginationFooter', () => {
  it('renders total count, visible range, and current page state', () => {
    renderFooter();

    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('1~10')).toBeInTheDocument();
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

  it('does not render the removed page size dropdown control', () => {
    renderFooter();

    expect(
      screen.queryByRole('button', { name: /페이지당 표시 개수 선택/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('씩 보기')).not.toBeInTheDocument();
  });

  it('can hide page navigation while keeping the range summary', () => {
    renderFooter({ pages: [1], showNavigation: false, totalCount: 10 });

    expect(screen.getByText('1~10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '1 페이지, 현재 페이지' })).not.toBeInTheDocument();
  });
});
