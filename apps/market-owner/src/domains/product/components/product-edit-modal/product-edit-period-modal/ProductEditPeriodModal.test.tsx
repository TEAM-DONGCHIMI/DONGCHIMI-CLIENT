import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

import { render, screen, userEvent, waitFor } from '@/test';

import { ProductEditPeriodModal } from './ProductEditPeriodModal';

describe('ProductEditPeriodModal', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses period values from product data as initial date fields', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 11, 9));

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
    expect(screen.getByLabelText('행사 시작일')).toHaveAttribute('min', '2026-07-11');
    expect(screen.getByLabelText('행사 종료일')).toHaveAttribute('min', '2026-08-12');
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

    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
    expect(screen.getByLabelText('행사 시작일')).not.toHaveFocus();
    expect(screen.getByLabelText('행사 종료일')).not.toHaveFocus();
  });

  it('disables submit when end date is before start date', () => {
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

    fireEvent.change(screen.getByLabelText('행사 종료일'), {
      target: { value: '2026-08-11' },
    });

    expect(screen.getByLabelText('행사 종료일')).toHaveAttribute('min', '2026-08-12');
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });

  it('disables submit when editable start date is before today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 11, 9));

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

    fireEvent.change(screen.getByLabelText('행사 시작일'), {
      target: { value: '2026-07-10' },
    });

    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
    expect(screen.getByLabelText('행사 종료일')).toHaveAttribute('min', '2026-07-11');
  });

  it('submits changed period when confirm button is pressed', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(true);
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

  it('keeps the modal open with entered dates when the request fails', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(false);
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

    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('행사 종료일')).toHaveValue('2026-08-17');
  });

  it('disables modal actions while submitting', () => {
    render(
      <ProductEditPeriodModal
        initialPeriod={{
          endDate: '2026. 8. 16',
          startDate: '2026. 8. 12',
        }}
        isSubmitting
        open
        variant='eventDiscount'
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '변경하기' })).toBeDisabled();
  });
});
