import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/test';
import { LeafletShareCard, type LeafletShareCardProps } from './LeafletShareCard';

const defaultProps = {
  onCopyLink: vi.fn(),
  onOpenQrCode: vi.fn(),
  shareUrl: 'dongchimi.kr/mangwon-fresh',
} satisfies LeafletShareCardProps;

describe('LeafletShareCard', () => {
  it('renders the leaflet share content', () => {
    render(<LeafletShareCard {...defaultProps} />);

    expect(screen.getByRole('heading', { name: '전단 공유하기' })).toBeInTheDocument();
    expect(
      screen.getByText('카카오톡·문자로 공유하거나 마트에 QR을 붙여보세요.'),
    ).toBeInTheDocument();
    expect(screen.getByText('dongchimi.kr/mangwon-fresh')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전단 공유 링크 복사' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '링크 복사' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '매장 고유 QR코드 보기' })).toBeInTheDocument();
  });

  it('calls onCopyLink from both copy controls', async () => {
    const handleCopyLink = vi.fn();
    const user = userEvent.setup();

    render(<LeafletShareCard {...defaultProps} onCopyLink={handleCopyLink} />);

    await user.click(screen.getByRole('button', { name: '전단 공유 링크 복사' }));
    await user.click(screen.getByRole('button', { name: '링크 복사' }));

    expect(handleCopyLink).toHaveBeenCalledTimes(2);
  });

  it('calls onOpenQrCode from the QR action', async () => {
    const handleOpenQrCode = vi.fn();
    const user = userEvent.setup();

    render(<LeafletShareCard {...defaultProps} onOpenQrCode={handleOpenQrCode} />);

    await user.click(screen.getByRole('button', { name: '매장 고유 QR코드 보기' }));

    expect(handleOpenQrCode).toHaveBeenCalledTimes(1);
  });

  it('disables every share action without changing the card content', async () => {
    const handleCopyLink = vi.fn();
    const handleOpenQrCode = vi.fn();
    const user = userEvent.setup();

    render(
      <LeafletShareCard
        {...defaultProps}
        disabled
        onCopyLink={handleCopyLink}
        onOpenQrCode={handleOpenQrCode}
      />,
    );

    const copyIconButton = screen.getByRole('button', { name: '전단 공유 링크 복사' });
    const copyActionButton = screen.getByRole('button', { name: '링크 복사' });
    const qrActionButton = screen.getByRole('button', { name: '매장 고유 QR코드 보기' });

    expect(copyIconButton).toBeDisabled();
    expect(copyActionButton).toBeDisabled();
    expect(qrActionButton).toBeDisabled();

    await user.click(copyIconButton);
    await user.click(copyActionButton);
    await user.click(qrActionButton);

    expect(handleCopyLink).not.toHaveBeenCalled();
    expect(handleOpenQrCode).not.toHaveBeenCalled();
  });
});
