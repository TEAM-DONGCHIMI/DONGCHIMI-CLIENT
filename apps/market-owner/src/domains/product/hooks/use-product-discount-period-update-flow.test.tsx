import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useProductDiscountPeriodUpdateFlow } from './use-product-discount-period-update-flow';
import { useProductDiscountPeriodUpdateMutation } from './use-product-discount-period-update-mutation';

vi.mock('./use-product-discount-period-update-mutation', () => ({
  useProductDiscountPeriodUpdateMutation: vi.fn(),
}));

const mockedUseProductDiscountPeriodUpdateMutation = vi.mocked(
  useProductDiscountPeriodUpdateMutation,
);
const mutateProductDiscountPeriodUpdate = vi.fn();
const toastError = vi.fn();

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => ({ error: toastError }),
}));
const params = {
  endDate: '2026-07-02',
  marketId: 1,
  productIds: [101, 102],
  startDate: '2026-06-30',
};

describe('useProductDiscountPeriodUpdateFlow', () => {
  beforeEach(() => {
    mutateProductDiscountPeriodUpdate.mockReset();
    toastError.mockReset();
    mockedUseProductDiscountPeriodUpdateMutation.mockReturnValue({
      mutateAsync: mutateProductDiscountPeriodUpdate,
    } as unknown as ReturnType<typeof useProductDiscountPeriodUpdateMutation>);
  });

  it('maps modal dates and product ids to the bulk update request', async () => {
    mutateProductDiscountPeriodUpdate.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    const { result } = renderHook(() => useProductDiscountPeriodUpdateFlow());
    let didUpdate = false;

    await act(async () => {
      didUpdate = await result.current.submitProductDiscountPeriodUpdate(params);
    });

    expect(didUpdate).toBe(true);
    expect(mutateProductDiscountPeriodUpdate).toHaveBeenCalledWith({
      marketId: 1,
      request: {
        discountStartDate: '2026-06-30',
        discountEndDate: '2026-07-02',
        productIds: [101, 102],
      },
    });
  });

  it('does not submit when no products are selected', async () => {
    const { result } = renderHook(() => useProductDiscountPeriodUpdateFlow());
    let didUpdate = true;

    await act(async () => {
      didUpdate = await result.current.submitProductDiscountPeriodUpdate({
        ...params,
        productIds: [],
      });
    });

    expect(didUpdate).toBe(false);
    expect(mutateProductDiscountPeriodUpdate).not.toHaveBeenCalled();
  });

  it('reports failure when the update fails', async () => {
    mutateProductDiscountPeriodUpdate.mockRejectedValue(new Error('update failed'));
    const { result } = renderHook(() => useProductDiscountPeriodUpdateFlow());
    let didUpdate = true;

    await act(async () => {
      didUpdate = await result.current.submitProductDiscountPeriodUpdate(params);
    });

    expect(didUpdate).toBe(false);
    expect(toastError).toHaveBeenCalledWith('행사 기간을 수정하지 못했습니다. 다시 시도해주세요.');
  });
});
