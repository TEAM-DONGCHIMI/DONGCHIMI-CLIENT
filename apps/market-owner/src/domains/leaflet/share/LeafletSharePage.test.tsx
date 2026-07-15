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

import { issueQrCode, publishLeaflet } from './api';
import { LeafletSharePage } from './LeafletSharePage';

vi.mock('./api', () => ({
  issueQrCode: vi.fn(),
  publishLeaflet: vi.fn(),
}));

const mockedIssueQrCode = vi.mocked(issueQrCode);
const mockedPublishLeaflet = vi.mocked(publishLeaflet);

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
    mockedIssueQrCode.mockReset();
    mockedPublishLeaflet.mockReset();
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

    await user.click(screen.getByRole('button', { name: '전단 공유하기' }));

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

    await user.click(screen.getByRole('button', { name: '전단 공유하기' }));

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

    await user.click(screen.getByRole('button', { name: '전단 공유하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '해당 마트에 대한 접근 권한이 없습니다.',
    );
    expect(screen.getByRole('heading', { name: '오늘의 전단 최종 확인' })).toBeInTheDocument();
  });

  it('keeps the QR issue flow connected to the shared QR modal', async () => {
    const user = userEvent.setup();

    mockedPublishLeaflet.mockResolvedValueOnce({ slug: 'VQ6EAOKbQdSnFkRlVUQAAA' });
    mockedIssueQrCode.mockResolvedValueOnce({ qrCode: 'base64-qr-code' });
    render(<LeafletSharePage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: '전단 공유하기' }));
    await user.click(await screen.findByRole('button', { name: '매장 고유 QR코드 보기' }));

    expect(mockedIssueQrCode.mock.calls[0]?.[0]).toBe(12);
    expect(await screen.findByRole('dialog', { name: '매장 고유 QR코드' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '매장 고유 QR코드' })).toHaveAttribute(
      'src',
      'data:image/png;base64,base64-qr-code',
    );
  });
});
