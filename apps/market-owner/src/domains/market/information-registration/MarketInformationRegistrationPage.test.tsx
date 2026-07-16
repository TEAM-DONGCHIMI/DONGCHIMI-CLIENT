import type { ReactNode } from 'react';

import { RouterProvider, createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { render, screen } from '@/test';

import { MarketInformationRegistrationPage } from './MarketInformationRegistrationPage';

const { authState } = vi.hoisted(() => ({
  authState: { marketId: undefined as number | undefined },
}));

vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => ({ completed: vi.fn() }),
}));

vi.mock('@/domains/market/components/market-information-form', () => ({
  MarketInformationForm: () => <div>마트 정보 등록 폼</div>,
  MarketInformationFormToastProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('../hooks', () => ({
  useMarketThumbnailUploadMutation: () => ({ isPending: false, mutateAsync: vi.fn() }),
  useRegisterMarketMutation: () => ({ isPending: false, mutateAsync: vi.fn() }),
}));

vi.mock('./hooks', () => ({
  useMarketAddressSearch: () => vi.fn(),
}));

const renderMarketInformationRegistrationPage = () => {
  const router = createMemoryRouter(
    [
      {
        element: <MarketInformationRegistrationPage />,
        path: MARKET_OWNER_ROUTES.marketInformationRegistration,
      },
      {
        element: <div>마트 정보 관리 페이지</div>,
        path: MARKET_OWNER_ROUTES.marketInformationManagement,
      },
    ],
    { initialEntries: [MARKET_OWNER_ROUTES.marketInformationRegistration] },
  );

  return render(<RouterProvider router={router} />);
};

describe('MarketInformationRegistrationPage', () => {
  beforeEach(() => {
    authState.marketId = undefined;
  });

  it('마트가 등록되지 않았으면 등록 폼을 표시한다', () => {
    renderMarketInformationRegistrationPage();

    expect(screen.getByText('마트 정보 등록 폼')).toBeInTheDocument();
  });

  it('이미 등록한 마트가 있으면 마트 정보 관리 페이지로 이동한다', async () => {
    authState.marketId = 12;

    renderMarketInformationRegistrationPage();

    expect(await screen.findByText('마트 정보 관리 페이지')).toBeInTheDocument();
    expect(screen.queryByText('마트 정보 등록 폼')).not.toBeInTheDocument();
  });
});
