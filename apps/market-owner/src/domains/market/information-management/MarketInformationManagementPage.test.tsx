import type { ReactNode } from 'react';

import { RouterProvider, createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/api-error';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { render, screen, userEvent, waitFor } from '@/test';

import { MarketInformationManagementPage } from './MarketInformationManagementPage';

const {
  authState,
  searchMarketAddress,
  toastCompleted,
  updateOwnerMarket,
  useOwnerMarketDetailQuery,
  useUpdateOwnerMarketMutation,
} = vi.hoisted(() => ({
  authState: { marketId: 12 as number | undefined },
  searchMarketAddress: vi.fn(),
  toastCompleted: vi.fn(),
  updateOwnerMarket: vi.fn(),
  useOwnerMarketDetailQuery: vi.fn(),
  useUpdateOwnerMarketMutation: vi.fn(),
}));

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => ({ completed: toastCompleted }),
}));

vi.mock('@/domains/market/hooks', () => ({
  useOwnerMarketDetailQuery,
  useUpdateOwnerMarketMutation,
}));

vi.mock('../information-registration/hooks', () => ({
  useMarketAddressSearch: () => searchMarketAddress,
}));

vi.mock('@/domains/market/components/market-information-form', () => ({
  MarketInformationForm: ({
    onAddressSearch,
    onDirtyChange,
    onSubmit,
  }: {
    onAddressSearch: () => void;
    onDirtyChange: (isDirty: boolean) => void;
    onSubmit: (request: unknown, form: unknown, reset: () => void) => Promise<void>;
  }) => (
    <>
      <button onClick={onAddressSearch}>주소 찾기</button>
      <button onClick={() => onDirtyChange(true)}>정보 변경</button>
      <button onClick={() => void onSubmit({}, {}, vi.fn())}>수정 완료</button>
    </>
  ),
  MarketInformationFormToastProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/domains/market/model', () => ({
  createMarketInformationForm: vi.fn(() => ({})),
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
        element: <div>홈 페이지</div>,
        path: MARKET_OWNER_ROUTES.home,
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
    searchMarketAddress.mockReset();
    toastCompleted.mockReset();
    updateOwnerMarket.mockReset();
    updateOwnerMarket.mockResolvedValue({ message: '서버 응답 메시지' });
    useOwnerMarketDetailQuery.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });
    useUpdateOwnerMarketMutation.mockReturnValue({
      isPending: false,
      mutateAsync: updateOwnerMarket,
    });
  });

  it('주소 찾기를 실행하면 마트 주소 검색을 호출한다', async () => {
    const user = userEvent.setup();
    useOwnerMarketDetailQuery.mockReturnValue({
      data: {},
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    renderMarketInformationManagementPage();

    await user.click(screen.getByRole('button', { name: '주소 찾기' }));

    expect(searchMarketAddress).toHaveBeenCalledOnce();
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

  it('마트 정보 수정에 성공하면 완료 메시지를 표시하고 홈으로 이동한다', async () => {
    const user = userEvent.setup();
    useOwnerMarketDetailQuery.mockReturnValue({
      data: {},
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    renderMarketInformationManagementPage();

    await user.click(screen.getByRole('button', { name: '정보 변경' }));
    await user.click(screen.getByRole('button', { name: '수정 완료' }));

    await waitFor(() => {
      expect(toastCompleted).toHaveBeenCalledWith('정보가 변경되었습니다.', {
        durationMs: 1500,
        id: 'market-information-management-completed',
      });
    });
    expect(screen.queryByText('홈 페이지')).not.toBeInTheDocument();
    expect(await screen.findByText('홈 페이지', {}, { timeout: 2500 })).toBeInTheDocument();
  });
});
