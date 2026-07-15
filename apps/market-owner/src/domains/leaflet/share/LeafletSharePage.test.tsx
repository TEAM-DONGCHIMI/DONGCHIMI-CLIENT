import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { OverlayProvider } from 'overlay-kit';
import { ToastProvider } from '@dongchimi/shared/toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api';
import { useAuthStore } from '@/shared/stores/auth-store';

import { getPeriodicPreview, issueQrCode, publishLeaflet } from './api';
import { LeafletSharePage } from './LeafletSharePage';

vi.mock('./api', () => ({
  getPeriodicPreview: vi.fn(),
  issueQrCode: vi.fn(),
  publishLeaflet: vi.fn(),
}));

const mockedGetPeriodicPreview = vi.mocked(getPeriodicPreview);
const mockedIssueQrCode = vi.mocked(issueQrCode);
const mockedPublishLeaflet = vi.mocked(publishLeaflet);

const periodicPreviewFixture = {
  marketId: 12,
  name: '망원 신선마트',
  thumbnailUrl: 'https://cdn.example.com/market.png',
  address: '서울 마포구 망원동',
  isOpenNow: true,
  businessHours: [{ days: ['월', '화'], isOpen: true, open: '10:00', close: '20:00' }],
  marketPhone1: '02-123-4567',
  marketPhone2: null,
  ownerPhone: '010-0000-0000',
  top3: [
    {
      productId: 101,
      name: '사과 500g',
      thumbnailUrl: 'https://cdn.example.com/apple.png',
      discountedPrice: 6900,
      discountRate: 10,
    },
  ],
  daily: {
    totalCount: 1,
    products: [
      {
        productId: 201,
        name: '콩나물 500g',
        thumbnailUrl: 'https://cdn.example.com/bean.png',
        originalPrice: 5000,
        discountedPrice: 4500,
        discountRate: 10,
      },
    ],
  },
  preparedProducts: [
    {
      preparedProductId: 301,
      name: '행사 상품',
      thumbnailUrl: 'https://cdn.example.com/periodic.png',
      discountedPrice: 3900,
    },
  ],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  const LeafletSharePageTestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <OverlayProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </OverlayProvider>
      </ToastProvider>
    </QueryClientProvider>
  );

  LeafletSharePageTestWrapper.displayName = 'LeafletSharePageTestWrapper';

  return LeafletSharePageTestWrapper;
};

describe('LeafletSharePage', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PUBLIC_CLIENT_BASE_URL', 'https://app.dongchiimi.com');
    mockedGetPeriodicPreview.mockReset();
    mockedIssueQrCode.mockReset();
    mockedPublishLeaflet.mockReset();
    mockedGetPeriodicPreview.mockResolvedValue(periodicPreviewFixture);
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setMarketId(12);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    useAuthStore.getState().clearSession();
  });

  it('publishes the leaflet and shows a share URL made from the returned slug', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    expect(mockedPublishLeaflet).not.toHaveBeenCalled();

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(mockedGetPeriodicPreview).toHaveBeenCalledWith(12);
    expect(mockedPublishLeaflet).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet.mock.calls[0]?.[0]).toBe(12);
    expect(
      await screen.findByText('https://app.dongchiimi.com/markets/VQ6EAOKbQdSnFkRlVUQAAA'),
    ).toBeInTheDocument();
  });

  it('disables the publish button while the request is pending', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockImplementation(() => new Promise(() => undefined));
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(screen.getByRole('button', { name: '전단 발행 중' })).toBeDisabled();
    expect(mockedPublishLeaflet).toHaveBeenCalledOnce();
  });

  it('shows the server message and keeps the confirmation view when publishing fails', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockRejectedValueOnce(
      new ApiError({
        code: 'FORBIDDEN_MARKET_ACCESS',
        message: '해당 마트에 대한 접근 권한이 없습니다.',
        status: 403,
        type: 'auth',
      }),
    );
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '해당 마트에 대한 접근 권한이 없습니다.',
    );
    expect(screen.getByRole('heading', { name: '오늘의 전단 최종 확인' })).toBeInTheDocument();
  });
});
