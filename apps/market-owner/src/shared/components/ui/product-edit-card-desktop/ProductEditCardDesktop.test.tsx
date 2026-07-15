import type { ComponentProps } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '../../../../test';
import { ProductEditCardDesktop } from './ProductEditCardDesktop';

const defaultProps = {
  categoryName: '정육',
  endDate: '2026. 8. 16',
  originalPrice: '5,000',
  productName: '삼겹살 500g',
  salePercent: '10',
  salePrice: '4,500',
  startDate: '2026. 8. 16',
  viewCount: 162,
} satisfies ComponentProps<typeof ProductEditCardDesktop>;

const renderCard = (props: Partial<ComponentProps<typeof ProductEditCardDesktop>> = {}) => {
  return render(<ProductEditCardDesktop {...defaultProps} {...props} />);
};

describe('ProductEditCardDesktop', () => {
  it('renders product edit card content with discount and period date', () => {
    renderCard();

    expect(screen.getByRole('article', { name: '삼겹살 500g 상품 수정 카드' })).toBeInTheDocument();
    expect(screen.getByText('정육')).toBeInTheDocument();
    expect(screen.getByText('162')).toBeInTheDocument();
    expect(screen.getByText('조회')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '삼겹살 500g' })).toBeInTheDocument();
    expect(screen.getByText('5,000원')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('4,500원')).toBeInTheDocument();
    expect(screen.getByText('2026. 8. 16~2026. 8. 16일까지')).toBeInTheDocument();
  });

  it('calls edit and delete actions', async () => {
    const handleEditClick = vi.fn();
    const handleDeleteClick = vi.fn();
    const user = userEvent.setup();

    renderCard({ onDeleteClick: handleDeleteClick, onEditClick: handleEditClick });

    await user.click(screen.getByRole('button', { name: '삼겹살 500g 상품 수정' }));
    await user.click(screen.getByRole('button', { name: '삼겹살 500g 상품 삭제' }));

    expect(handleEditClick).toHaveBeenCalledOnce();
    expect(handleDeleteClick).toHaveBeenCalledOnce();
  });

  it('renders selected state and calls selection action', async () => {
    const handleSelectClick = vi.fn();
    const user = userEvent.setup();

    renderCard({ selectionState: 'selected', onSelectClick: handleSelectClick });

    const selectButton = screen.getByRole('button', { name: '삼겹살 500g 상품 선택' });

    expect(selectButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(selectButton);

    expect(handleSelectClick).toHaveBeenCalledOnce();
  });

  it('renders selectable state without pressed state', () => {
    renderCard({ selectionState: 'selectable' });

    expect(screen.getByRole('button', { name: '삼겹살 500g 상품 선택' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('hides discount details and start date when discount flags are disabled', () => {
    renderCard({
      periodDiscountDate: false,
      todayDiscountPrice: false,
    });

    expect(screen.queryByText('5,000원')).not.toBeInTheDocument();
    expect(screen.queryByText('10%')).not.toBeInTheDocument();
    expect(screen.getByText('4,500원')).toBeInTheDocument();
    expect(screen.getByText('2026. 8. 16일까지')).toBeInTheDocument();
  });

  it('formats view count and uses 0 when view count is missing', () => {
    const { rerender } = renderCard({ viewCount: 1200 });

    expect(screen.getByText('1.2천')).toBeInTheDocument();
    expect(screen.getByText('조회')).toBeInTheDocument();

    rerender(<ProductEditCardDesktop {...defaultProps} viewCount={10000} />);

    expect(screen.getByText('1만')).toBeInTheDocument();

    rerender(<ProductEditCardDesktop {...defaultProps} viewCount={undefined} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
