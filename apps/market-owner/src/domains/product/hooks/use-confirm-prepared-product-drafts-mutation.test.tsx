import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/shared/query';

import { confirmPreparedProductDrafts } from '../api/confirm-prepared-product-drafts';
import { productQueryKeys } from '../query-keys';
import { useConfirmPreparedProductDraftsMutation } from './use-confirm-prepared-product-drafts-mutation';

vi.mock('../api/confirm-prepared-product-drafts', () => ({
  confirmPreparedProductDrafts: vi.fn(),
}));

const mockedConfirmPreparedProductDrafts = vi.mocked(confirmPreparedProductDrafts);

const createWrapper = (queryClient: QueryClient) => {
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return TestQueryProvider;
};

describe('useConfirmPreparedProductDraftsMutation', () => {
  beforeEach(() => {
    mockedConfirmPreparedProductDrafts.mockReset();
  });

  it('passes the market id to the API helper', async () => {
    const response = { success: true, code: 'SUCCESS', message: '요청에 성공했습니다.' };
    mockedConfirmPreparedProductDrafts.mockResolvedValue(response);
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useConfirmPreparedProductDraftsMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      act(async () => {
        return result.current.mutateAsync(12);
      }),
    ).resolves.toEqual(response);
    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledWith(12);
  });

  it('invalidates product queries after confirmation succeeds', async () => {
    const queryClient = createQueryClient();
    const draftQueryKey = productQueryKeys.preparedDrafts({
      categories: [],
      fetchAll: true,
      marketId: 12,
      page: 0,
      search: '',
      size: 20,
    });
    const listQueryKey = productQueryKeys.listByMarket(12);

    queryClient.setQueryData(draftQueryKey, { data: { content: [] } });
    queryClient.setQueryData(listQueryKey, { data: { content: [] } });
    mockedConfirmPreparedProductDrafts.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });

    const { result } = renderHook(() => useConfirmPreparedProductDraftsMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(12);
    });

    expect(queryClient.getQueryState(draftQueryKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(listQueryKey)?.isInvalidated).toBe(true);
  });
});
