import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '@/app/AppProviders';
import { downloadQrCodeImage } from '@/shared/utils/qr-code-image.utils';
import type * as QrCodeImageUtils from '@/shared/utils/qr-code-image.utils';
import { render, screen } from '@/test';

import { HomePage } from './HomePage';

vi.mock('./sections', () => ({
  HomeDashboardSection: ({ onOpenQrCode }: { onOpenQrCode: (qrCode?: string | null) => void }) => (
    <div>
      <button onClick={() => onOpenQrCode('base64-value')} type='button'>
        QR 모달 열기
      </button>
      <button onClick={() => onOpenQrCode(null)} type='button'>
        빈 QR 열기
      </button>
    </div>
  ),
  HomeHeroSection: () => null,
}));

vi.mock('@/shared/utils/qr-code-image.utils', async (importOriginal) => {
  const original = await importOriginal<typeof QrCodeImageUtils>();

  return {
    ...original,
    downloadQrCodeImage: vi.fn(),
  };
});

const mockedDownloadQrCodeImage = vi.mocked(downloadQrCodeImage);

const renderHomePage = () => {
  return render(
    <AppProviders>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </AppProviders>,
  );
};

describe('HomePage QR modal', () => {
  beforeEach(() => {
    mockedDownloadQrCodeImage.mockReset();
  });

  it('opens the shared QR modal with the home response QR image', async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.click(screen.getByRole('button', { name: 'QR 모달 열기' }));

    expect(await screen.findByRole('dialog', { name: '매장 고유 QR코드' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '매장 고유 QR코드' })).toHaveAttribute(
      'src',
      'data:image/png;base64,base64-value',
    );
  });

  it('shows an error toast instead of opening the modal when the QR value is missing', async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.click(screen.getByRole('button', { name: '빈 QR 열기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'QR 코드를 불러오지 못했습니다. 다시 시도해주세요.',
    );
    expect(screen.queryByRole('dialog', { name: '매장 고유 QR코드' })).not.toBeInTheDocument();
  });

  it('downloads the QR image and closes the modal', async () => {
    const user = userEvent.setup();

    renderHomePage();

    await user.click(screen.getByRole('button', { name: 'QR 모달 열기' }));
    await user.click(await screen.findByRole('button', { name: '매장 고유 QR코드 다운로드' }));

    expect(mockedDownloadQrCodeImage).toHaveBeenCalledWith(
      'data:image/png;base64,base64-value',
      'market-leaflet-qr.png',
    );
    expect(screen.queryByRole('dialog', { name: '매장 고유 QR코드' })).not.toBeInTheDocument();
  });

  it('keeps the modal open and shows an error toast when download fails', async () => {
    const user = userEvent.setup();
    mockedDownloadQrCodeImage.mockImplementationOnce(() => {
      throw new Error('download failed');
    });

    renderHomePage();

    await user.click(screen.getByRole('button', { name: 'QR 모달 열기' }));
    await user.click(await screen.findByRole('button', { name: '매장 고유 QR코드 다운로드' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'QR 이미지 다운로드를 실패했습니다.',
    );
    expect(screen.getByRole('dialog', { name: '매장 고유 QR코드' })).toBeInTheDocument();
  });
});
