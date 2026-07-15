import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getOwnerHome } from '../api/get-owner-home';
import { ownerHomeFixture } from '../fixtures/owner-home-api.fixture';
import { homeQueryKeys } from '../query-keys';
import { ownerHomeQueryOptions } from '../query-options/owner-home-query-options';

import { useOwnerHomeQuery } from './use-owner-home-query';

vi.mock('../api/get-owner-home', () => ({
  getOwnerHome: vi.fn(),
}));

const mockedGetOwnerHome = vi.mocked(getOwnerHome);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const TestQueryProvider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestQueryProvider.displayName = 'TestQueryProvider';

  return { queryClient, TestQueryProvider };
};

describe('useOwnerHomeQuery', () => {
  beforeEach(() => {
    mockedGetOwnerHome.mockReset();
  });

  it('uses the owner-home query key and exposes validated home data', async () => {
    const { queryClient, TestQueryProvider } = createWrapper();
    mockedGetOwnerHome.mockResolvedValue(ownerHomeFixture);

    const { result } = renderHook(() => useOwnerHomeQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetOwnerHome).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(homeQueryKeys.ownerHome())).toEqual(ownerHomeFixture);
  });

  it('keeps the error in query state for the dashboard retry UI', async () => {
    const { TestQueryProvider } = createWrapper();
    mockedGetOwnerHome.mockRejectedValue(new Error('home request failed'));

    const { result } = renderHook(() => useOwnerHomeQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('uses the domain query key and local error boundary policy', () => {
    const options = ownerHomeQueryOptions();

    expect(options.queryKey).toEqual(homeQueryKeys.ownerHome());
    expect(options.throwOnError).toBe(false);
  });
});
