import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';

import { homeShare } from '../fixtures';
import { type HomeShareTypes } from '../model/home-dashboard-view-model';

import { HomeShareSection, type HomeShareSectionProps } from './HomeShareSection';

const defaultProps = {
  onCopyLinkResult: vi.fn(),
  onQrCodePreparing: vi.fn(),
} satisfies Omit<HomeShareSectionProps, 'share'>;

const availableShare: HomeShareTypes = {
  ...homeShare,
  flyer: {
    flyerId: 1,
    qrCode: 'QR코드 base64 이미지',
    slug: 'mangwon-fresh',
  },
};

describe('HomeShareSection', () => {
  it('renders the share URL and enabled actions when a flyer exists', () => {
    render(<HomeShareSection {...defaultProps} share={availableShare} />);

    expect(screen.getByText(homeShare.url)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전단 공유 링크 복사' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '링크 복사' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '매장 고유 QR코드 보기' })).toBeEnabled();
  });

  it('dims the share card and removes only the URL text when a flyer does not exist', () => {
    render(<HomeShareSection {...defaultProps} share={{ ...availableShare, flyer: null }} />);

    expect(screen.queryByText(homeShare.url)).not.toBeInTheDocument();
    expect(screen.getByText(/전단을 공유하려면\s*상품을 먼저 등록해주세요\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전단 공유 링크 복사' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '링크 복사' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '매장 고유 QR코드 보기' })).toBeDisabled();
  });
});
