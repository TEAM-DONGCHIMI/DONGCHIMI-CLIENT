import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen, waitFor } from '@/test';

import { LoginPage } from './LoginPage';

const RETURN_TO = '/markets/mangwon-fresh/products/402?tab=detail';

vi.mock('next/image', () => ({
  default: () => null,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    window.history.replaceState(
      {},
      '',
      `/login?reason=auth-required&returnTo=${encodeURIComponent(RETURN_TO)}`,
    );
  });

  it('인증 필요 진입이면 mobile Toast를 한 번 표시하고 reason만 URL에서 제거한다', async () => {
    renderWithProviders(
      <StrictMode>
        <LoginPage isAuthRequired returnTo={RETURN_TO} />
      </StrictMode>,
    );

    const alerts = await screen.findAllByRole('alert');

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toHaveTextContent('서비스 이용을 위해 로그인이 필요해요.');
    expect(screen.getByRole('link', { name: '카카오톡으로 시작하기' })).toHaveAttribute(
      'href',
      '/api/auth/kakao/authorize?returnTo=%2Fmarkets%2Fmangwon-fresh%2Fproducts%2F402%3Ftab%3Ddetail',
    );

    await waitFor(() => {
      const searchParams = new URLSearchParams(window.location.search);

      expect(searchParams.get('reason')).toBeNull();
      expect(searchParams.get('returnTo')).toBe(RETURN_TO);
    });
  });

  it('직접 로그인 진입이면 인증 필요 Toast를 표시하지 않는다', () => {
    window.history.replaceState({}, '', '/login');

    renderWithProviders(<LoginPage isAuthRequired={false} returnTo='/markets' />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '카카오톡으로 시작하기' })).toHaveAttribute(
      'href',
      '/api/auth/kakao/authorize?returnTo=%2Fmarkets',
    );
  });
});
