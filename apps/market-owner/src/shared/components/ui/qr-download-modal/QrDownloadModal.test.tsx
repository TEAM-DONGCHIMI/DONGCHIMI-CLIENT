import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';

import { QrDownloadModal } from './QrDownloadModal';

const defaultProps = {
  imageLabel: '매장 고유 QR코드',
  imageSrc: 'data:image/png;base64,base64-value',
  onClose: vi.fn(),
  onDownload: vi.fn(),
  open: true,
};

describe('QrDownloadModal', () => {
  it('renders an accessible dialog with the provided QR image', () => {
    render(<QrDownloadModal {...defaultProps} />);

    expect(screen.getByRole('dialog', { name: '매장 고유 QR코드' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: defaultProps.imageLabel })).toHaveAttribute(
      'src',
      defaultProps.imageSrc,
    );
  });

  it('calls the caller-owned download action', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(<QrDownloadModal {...defaultProps} onDownload={onDownload} />);

    await user.click(screen.getByRole('button', { name: '매장 고유 QR코드 다운로드' }));

    expect(onDownload).toHaveBeenCalledOnce();
  });
});
