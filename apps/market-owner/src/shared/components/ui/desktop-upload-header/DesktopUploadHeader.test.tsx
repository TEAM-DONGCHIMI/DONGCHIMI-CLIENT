import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../../test';
import { DesktopUploadHeader } from './DesktopUploadHeader';

const defaultProps = {
  completedCount: 112,
  needsEditCount: 12,
  selectedSegment: 'total' as const,
  totalCount: 128,
  onSegmentChange: vi.fn(),
};

describe('DesktopUploadHeader', () => {
  it('renders fixed segment labels with provided counts', () => {
    render(<DesktopUploadHeader {...defaultProps} />);

    expect(screen.getByRole('button', { name: '총 상품 128' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '등록 완료 112' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정 필요 12' })).toBeInTheDocument();
  });

  it('calls onSegmentChange with selected segment value', async () => {
    const handleSegmentChange = vi.fn();
    const user = userEvent.setup();

    render(<DesktopUploadHeader {...defaultProps} onSegmentChange={handleSegmentChange} />);

    await user.click(screen.getByRole('button', { name: '수정 필요 12' }));

    expect(handleSegmentChange).toHaveBeenCalledWith('needsEdit');
  });

  it('marks provided selected segment as current', () => {
    render(<DesktopUploadHeader {...defaultProps} selectedSegment='completed' />);

    expect(screen.getByRole('button', { name: '등록 완료 112' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '총 상품 128' })).not.toHaveAttribute('aria-current');
  });

  it('disables delete selected action when nothing is selected', () => {
    render(<DesktopUploadHeader {...defaultProps} selectedCount={0} />);

    expect(screen.getByText('선택된 상품 (0)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '선택삭제' })).toBeDisabled();
  });

  it('enables delete selected action when selected count is greater than zero', async () => {
    const handleDeleteSelected = vi.fn();
    const user = userEvent.setup();

    render(
      <DesktopUploadHeader
        {...defaultProps}
        selectedCount={2}
        onDeleteSelected={handleDeleteSelected}
      />,
    );

    await user.click(screen.getByRole('button', { name: '선택삭제' }));

    expect(screen.getByText('선택된 상품 (2)')).toBeInTheDocument();
    expect(handleDeleteSelected).toHaveBeenCalledTimes(1);
  });

  it('renders sort action and submits search value', async () => {
    const handleSortClick = vi.fn();
    const handleSearch = vi.fn();
    const user = userEvent.setup();

    render(
      <DesktopUploadHeader
        {...defaultProps}
        onSearch={handleSearch}
        onSortClick={handleSortClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: '정렬' }));
    await user.type(screen.getByRole('searchbox', { name: '상품 검색' }), '감자');
    await user.keyboard('{Enter}');

    expect(handleSortClick).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('감자', expect.any(Object));
  });
});
