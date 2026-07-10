import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

import { render, screen, userEvent, waitFor } from '@/test';

import { ProductEditPeriodModal } from './ProductEditPeriodModal';

describe('ProductEditPeriodModal', () => {
  it('uses period values from product data as initial date fields', () => {
    render(
      <ProductEditPeriodModal
        initialPeriod={{
          endDate: '2026. 8. 16',
          startDate: '2026. 8. 12',
        }}
        open
        variant='eventDiscount'
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('행사 시작일')).toHaveValue('2026-08-12');
    expect(screen.getByLabelText('행사 종료일')).toHaveValue('2026-08-16');
  });

  it('does not focus date fields when opened', async () => {
    render(
      <ProductEditPeriodModal
        initialPeriod={{
          endDate: '2026. 8. 16',
          startDate: '2026. 8. 12',
        }}
        open
        variant='eventDiscount'
        onClose={vi.fn()}
      />,
    );

    const title = screen.getByRole('heading', {
      name: '선택된 상품들의 판매 기간을 수정해주세요',
    });

    await waitFor(() => expect(title).toHaveFocus());
    expect(screen.getByLabelText('행사 시작일')).not.toHaveFocus();
    expect(screen.getByLabelText('행사 종료일')).not.toHaveFocus();
  });

  it('submits changed period when confirm button is pressed', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProductEditPeriodModal
        initialPeriod={{
          endDate: '2026. 8. 16',
          startDate: '2026. 8. 12',
        }}
        open
        variant='eventDiscount'
        onClose={handleClose}
        onSubmit={handleSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText('행사 종료일'), {
      target: { value: '2026-08-17' },
    });
    await user.click(screen.getByRole('button', { name: '변경하기' }));

    expect(handleSubmit).toHaveBeenCalledWith({
      endDate: '2026-08-17',
      startDate: '2026-08-12',
    });
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
