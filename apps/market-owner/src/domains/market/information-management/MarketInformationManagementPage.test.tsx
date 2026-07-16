import type { ReactNode } from 'react';

import { RouterProvider, createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/api-error';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { render, screen } from '@/test';

import { MarketInformationManagementPage } from './MarketInformationManagementPage';

const { authState, useOwnerMarketDetailQuery, useUpdateOwnerMarketMutation } = vi.hoisted(() => ({
  authState: { marketId: 12 as number | undefined },
  useOwnerMarketDetailQuery: vi.fn(),
  useUpdateOwnerMarketMutation: vi.fn(),
}));

vi.mock('@/domains/market/hooks', () => ({
  useOwnerMarketDetailQuery,
  useUpdateOwnerMarketMutation,
}));

vi.mock('@/domains/market/components/market-information-form', () => ({
  MarketInformationForm: () => <div>마트 정보 관리 폼</div>,
  MarketInformationFormToastProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

const renderMarketInformationManagementPage = () => {
  const router = createMemoryRouter(
    [
      {
        element: <MarketInformationManagementPage />,
        path: MARKET_OWNER_ROUTES.marketInformationManagement,
      },
      {
        element: <div>마트 정보 등록 페이지</div>,
        path: MARKET_OWNER_ROUTES.marketInformationRegistration,
      },
    ],
    { initialEntries: [MARKET_OWNER_ROUTES.marketInformationManagement] },
  );

  return render(<RouterProvider router={router} />);
};

describe('MarketInformationManagementPage', () => {
  beforeEach(() => {
    authState.marketId = 12;
    useOwnerMarketDetailQuery.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });
    useUpdateOwnerMarketMutation.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    });
  });

  it('marketId가 없으면 마트 정보 등록 페이지로 이동한다', async () => {
    authState.marketId = undefined;

    renderMarketInformationManagementPage();

    expect(await screen.findByText('마트 정보 등록 페이지')).toBeInTheDocument();
  });

  it('마트 상세 조회가 MARKET_NOT_FOUND로 실패하면 마트 정보 등록 페이지로 이동한다', async () => {
    useOwnerMarketDetailQuery.mockReturnValue({
      data: undefined,
      error: new ApiError({
        code: 'MARKET_NOT_FOUND',
        message: '마트를 찾을 수 없습니다.',
        status: 404,
        type: 'client',
      }),
      isError: true,
      isPending: false,
      refetch: vi.fn(),
    });

    renderMarketInformationManagementPage();

    expect(await screen.findByText('마트 정보 등록 페이지')).toBeInTheDocument();
    expect(screen.queryByText('마트 정보를 찾을 수 없습니다.')).not.toBeInTheDocument();
  });
});
