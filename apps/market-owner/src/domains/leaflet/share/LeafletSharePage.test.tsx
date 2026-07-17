import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router';
import { OverlayProvider } from 'overlay-kit';
import { ToastProvider } from '@dongchimi/shared/toast';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { confirmPreparedProductDrafts } from '@/domains/product/api/confirm-prepared-product-drafts';
import { ApiError } from '@/shared/api';
import { MARKET_OWNER_ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

import { getPeriodicPreview, issueQrCode, publishLeaflet } from './api';
import { LeafletSharePage } from './LeafletSharePage';
import { leafletShareQueryKeys } from './query-keys';

vi.mock('./api', () => ({
  getPeriodicPreview: vi.fn(),
  issueQrCode: vi.fn(),
  publishLeaflet: vi.fn(),
}));
vi.mock('@/domains/product/api/confirm-prepared-product-drafts', () => ({
  confirmPreparedProductDrafts: vi.fn(),
}));

const mockedConfirmPreparedProductDrafts = vi.mocked(confirmPreparedProductDrafts);
const mockedGetPeriodicPreview = vi.mocked(getPeriodicPreview);
const mockedIssueQrCode = vi.mocked(issueQrCode);
const mockedPublishLeaflet = vi.mocked(publishLeaflet);

const periodicPreviewFixture = {
  marketId: 12,
  name: '망원 신선마트',
  thumbnailUrl: 'https://cdn.example.com/market.png',
  address: '서울 마포구 망원동',
  isOpenNow: true,
  businessHours: [{ days: ['MONDAY', 'TUESDAY'], isOpen: true, open: '10:00', close: '20:00' }],
  isHolidayClosed: false,
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

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        retry: false,
      },
    },
  });
};

const createWrapper = (queryClient = createTestQueryClient()) => {
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

const renderRoutedPage = () => {
  const router = createMemoryRouter(
    [
      {
        path: MARKET_OWNER_ROUTES.leafletShare,
        element: <LeafletSharePage />,
      },
      {
        path: MARKET_OWNER_ROUTES.registrationResult,
        element: <h1>파일 등록 상품 수정 확인</h1>,
      },
    ],
    { initialEntries: [MARKET_OWNER_ROUTES.leafletShare] },
  );

  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <ToastProvider>
        <OverlayProvider>
          <RouterProvider router={router} />
        </OverlayProvider>
      </ToastProvider>
    </QueryClientProvider>,
  );

  return router;
};

describe('LeafletSharePage', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PUBLIC_CLIENT_BASE_URL', 'https://app.dongchiimi.com');
    mockedGetPeriodicPreview.mockReset();
    mockedIssueQrCode.mockReset();
    mockedPublishLeaflet.mockReset();
    mockedConfirmPreparedProductDrafts.mockReset();
    mockedGetPeriodicPreview.mockResolvedValue(periodicPreviewFixture);
    mockedConfirmPreparedProductDrafts.mockResolvedValue({
      success: true,
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
    });
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setMarketId(12);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    useAuthStore.getState().clearSession();
  });

  it('confirms product drafts before publishing and shows the returned share URL', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    expect(screen.getByRole('navigation', { name: '현재 위치' })).toHaveTextContent(
      '행사 할인 상품 등록/오늘의 전단 최종 확인',
    );
    expect(screen.queryByRole('searchbox', { name: '상품 검색' })).not.toBeInTheDocument();
    expect(mockedPublishLeaflet).not.toHaveBeenCalled();

    const shareButton = await screen.findByRole('button', { name: '전단 공유하기' });
    expect(mockedGetPeriodicPreview).toHaveBeenCalledWith(12);
    expect(screen.queryByRole('searchbox', { name: '상품 검색' })).not.toBeInTheDocument();

    await user.click(shareButton);

    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledOnce();
    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledWith(12);
    expect(mockedPublishLeaflet).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet.mock.calls[0]?.[0]).toBe(12);
    expect(mockedConfirmPreparedProductDrafts.mock.invocationCallOrder[0]).toBeLessThan(
      mockedPublishLeaflet.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
    expect(
      await screen.findByText('https://app.dongchiimi.com/markets/VQ6EAOKbQdSnFkRlVUQAAA'),
    ).toBeInTheDocument();
  });

  it('does not block product confirmation and leaflet publishing when the client base URL is not configured', async () => {
    const user = userEvent.setup();

    vi.stubEnv('VITE_PUBLIC_CLIENT_BASE_URL', '');
    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet).toHaveBeenCalledOnce();
    expect(
      await screen.findByText(`${window.location.origin}/markets/VQ6EAOKbQdSnFkRlVUQAAA`),
    ).toBeInTheDocument();
  });

  it('routes back to the product registration result when editing the leaflet', async () => {
    const user = userEvent.setup();
    const router = renderRoutedPage();

    await user.click(await screen.findByRole('button', { name: '전단 수정하기' }));

    expect(
      await screen.findByRole('heading', { name: '파일 등록 상품 수정 확인' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(MARKET_OWNER_ROUTES.registrationResult);
  });

  it('disables the share action while product confirmation is pending', async () => {
    const user = userEvent.setup();

    mockedConfirmPreparedProductDrafts.mockImplementation(() => new Promise(() => undefined));
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(screen.getByRole('button', { name: '전단 발행 중' })).toBeDisabled();
    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet).not.toHaveBeenCalled();
  });

  it('keeps the share action disabled while leaflet publishing is pending', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockImplementation(() => new Promise(() => undefined));
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(screen.getByRole('button', { name: '전단 발행 중' })).toBeDisabled();
    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet).toHaveBeenCalledOnce();
  });

  it('shows the server message and does not publish when product confirmation fails', async () => {
    const user = userEvent.setup();

    mockedConfirmPreparedProductDrafts.mockRejectedValueOnce(
      new ApiError({
        code: 'DRAFT_NOT_COMPLETED',
        message: '등록 완료되지 않은 임시 상품이 있습니다.',
        status: 409,
        type: 'client',
      }),
    );
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '등록 완료되지 않은 임시 상품이 있습니다.',
    );
    expect(mockedPublishLeaflet).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: '오늘의 전단 최종 확인' })).toBeInTheDocument();
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
    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: '오늘의 전단 최종 확인' })).toBeInTheDocument();
  });

  it('retries only publishing after product confirmation has already succeeded', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet
      .mockRejectedValueOnce(new Error('Publish failed.'))
      .mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    const shareButton = await screen.findByRole('button', { name: '전단 공유하기' });
    await user.click(shareButton);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '전단을 발행하지 못했습니다. 다시 시도해주세요.',
    );

    await user.click(shareButton);

    expect(mockedConfirmPreparedProductDrafts).toHaveBeenCalledOnce();
    expect(mockedPublishLeaflet).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText('https://app.dongchiimi.com/markets/VQ6EAOKbQdSnFkRlVUQAAA'),
    ).toBeInTheDocument();
  });

  it('keeps the loaded preview visible when refetch fails', async () => {
    const queryClient = createTestQueryClient();

    mockedGetPeriodicPreview.mockResolvedValueOnce(periodicPreviewFixture);
    mockedGetPeriodicPreview.mockRejectedValueOnce(new Error('Periodic preview refetch failed.'));
    render(<LeafletSharePage />, { wrapper: createWrapper(queryClient) });

    expect(await screen.findByRole('button', { name: '전단 공유하기' })).toBeInTheDocument();

    await queryClient.invalidateQueries({
      queryKey: leafletShareQueryKeys.periodicPreview(12),
    });

    await waitFor(() => {
      expect(mockedGetPeriodicPreview).toHaveBeenCalledTimes(2);
    });
    expect(screen.getByRole('button', { name: '다시 불러오기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전단 공유하기' })).toBeInTheDocument();
  });

  it('keeps the QR issue flow connected to the shared QR modal', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    mockedIssueQrCode.mockResolvedValueOnce({ qrCode: 'base64-qr-code' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));
    await user.click(await screen.findByRole('button', { name: '매장 고유 QR코드 보기' }));

    expect(mockedIssueQrCode.mock.calls[0]?.[0]).toBe(12);
    expect(await screen.findByRole('dialog', { name: '매장 고유 QR코드' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '매장 고유 QR코드' })).toHaveAttribute(
      'src',
      'data:image/png;base64,base64-qr-code',
    );
  });

  it.each(['전단 공유 링크 복사', '링크 복사'])(
    '%s copies the published share URL and shows the completed toast',
    async (copyButtonName) => {
      const user = userEvent.setup();
      const writeText = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText },
      });
      mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
      render(<LeafletSharePage />, { wrapper: createWrapper() });

      await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));
      await user.click(await screen.findByRole('button', { name: copyButtonName }));

      expect(writeText).toHaveBeenCalledWith(
        'https://app.dongchiimi.com/markets/VQ6EAOKbQdSnFkRlVUQAAA',
      );
      expect(await screen.findByRole('status')).toHaveTextContent('전단 링크가 복사되었습니다.');
    },
  );

  it('keeps a single completed toast when the share link is copied repeatedly', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));

    const copyButton = await screen.findByRole('button', { name: '링크 복사' });
    await user.click(copyButton);
    await user.click(copyButton);
    await user.click(copyButton);

    expect(writeText).toHaveBeenCalledTimes(3);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('전단 링크가 복사되었습니다.');
  });

  it('shows an error toast when the share link icon cannot use the clipboard', async () => {
    const user = userEvent.setup();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole('button', { name: '전단 공유하기' }));
    await user.click(await screen.findByRole('button', { name: '전단 공유 링크 복사' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /링크를 복사하지 못했습니다\.\s*다시 시도해주세요\./,
    );
  });
});
