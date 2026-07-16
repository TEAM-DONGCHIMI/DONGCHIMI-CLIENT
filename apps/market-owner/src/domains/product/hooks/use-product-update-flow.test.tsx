import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useProductThumbnailUpload } from './use-product-thumbnail-upload';
import { useProductUpdateFlow } from './use-product-update-flow';
import { useProductUpdateMutation } from './use-product-update-mutation';

vi.mock('./use-product-thumbnail-upload', () => ({
  useProductThumbnailUpload: vi.fn(),
}));

vi.mock('./use-product-update-mutation', () => ({
  useProductUpdateMutation: vi.fn(),
}));

const mockedUseProductThumbnailUpload = vi.mocked(useProductThumbnailUpload);
const mockedUseProductUpdateMutation = vi.mocked(useProductUpdateMutation);
const uploadProductThumbnail = vi.fn();
const mutateProductUpdate = vi.fn();
const toastError = vi.fn();

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => ({ error: toastError }),
}));

const commonParams = {
  currentThumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
  dealType: 'DAILY' as const,
  imageFile: null,
  marketId: 1,
  productId: 101,
  values: {
    categoryName: '정육/달걀' as const,
    endDate: '2026-06-30',
    originalPrice: '22,000',
    productName: '삼겹살 500g',
    promotionText: '오늘 입고된 신선한 삼겹살',
    salePrice: '19,500',
    startDate: '2026-06-30',
  },
};

describe('useProductUpdateFlow', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    uploadProductThumbnail.mockReset();
    mutateProductUpdate.mockReset();
    toastError.mockReset();
    mockedUseProductThumbnailUpload.mockReturnValue({ uploadProductThumbnail });
    mockedUseProductUpdateMutation.mockReturnValue({
      mutateAsync: mutateProductUpdate,
    } as unknown as ReturnType<typeof useProductUpdateMutation>);
  });

  it('keeps the current thumbnail when update succeeds', async () => {
    mutateProductUpdate.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    const { result } = renderHook(() => useProductUpdateFlow());
    let updateResult: Awaited<
      ReturnType<ReturnType<typeof useProductUpdateFlow>['submitProductUpdate']>
    > = { success: false };

    await act(async () => {
      updateResult = await result.current.submitProductUpdate(commonParams);
    });

    expect(updateResult).toEqual({
      success: true,
      thumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
    });
    expect(uploadProductThumbnail).not.toHaveBeenCalled();
    expect(mutateProductUpdate).toHaveBeenCalledWith({
      marketId: 1,
      productId: 101,
      request: expect.objectContaining({
        type: 'DAILY',
        thumbnailUrl: 'https://cdn.dongchimi.kr/products/101.png',
        originalPrice: 22000,
      }),
    });
  });

  it('sends a new image object key to the update API and returns its public URL for display', async () => {
    const imageFile = new File(['image'], 'product.png', { type: 'image/png' });
    uploadProductThumbnail.mockResolvedValue({
      objectKey: 'tmp/PRODUCT_THUMBNAIL/product.png',
      publicUrl: 'https://static.dongchimi.kr/tmp/PRODUCT_THUMBNAIL/product.png',
    });
    mutateProductUpdate.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    const { result } = renderHook(() => useProductUpdateFlow());

    let updateResult: Awaited<
      ReturnType<ReturnType<typeof useProductUpdateFlow>['submitProductUpdate']>
    > = { success: false };

    await act(async () => {
      updateResult = await result.current.submitProductUpdate({ ...commonParams, imageFile });
    });

    expect(uploadProductThumbnail).toHaveBeenCalledWith(imageFile);
    expect(mutateProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          thumbnailUrl: 'tmp/PRODUCT_THUMBNAIL/product.png',
        }),
      }),
    );
    expect(updateResult).toEqual({
      success: true,
      thumbnailUrl: 'https://static.dongchimi.kr/tmp/PRODUCT_THUMBNAIL/product.png',
    });
  });

  it('reports failure when the update request fails', async () => {
    mutateProductUpdate.mockRejectedValue(new TypeError('Failed to fetch'));
    const { result } = renderHook(() => useProductUpdateFlow());
    let updateResult: Awaited<
      ReturnType<ReturnType<typeof useProductUpdateFlow>['submitProductUpdate']>
    > = { success: true, thumbnailUrl: null };

    await act(async () => {
      updateResult = await result.current.submitProductUpdate(commonParams);
    });

    expect(updateResult).toEqual({ success: false });
    expect(toastError).toHaveBeenCalledWith('인터넷 연결을 확인한 후 다시 시도해주세요.');
  });
});
