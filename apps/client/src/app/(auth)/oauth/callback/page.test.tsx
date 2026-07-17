import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';

import Page from './page';

vi.mock('@/domains/auth/oauth-callback/OAuthCallbackPage', () => ({
  OAuthCallbackPage: () => {
    throw new Promise(() => undefined);
  },
}));

vi.mock('@/domains/auth/oauth-callback/components/OAuthCallbackLoading', () => ({
  OAuthCallbackLoading: () => <div data-testid='oauth-callback-loading' />,
}));

describe('/oauth/callback page', () => {
  it('route가 suspend되면 공통 Lottie loading fallback을 표시한다', () => {
    render(<Page />);

    expect(screen.getByTestId('oauth-callback-loading')).toBeInTheDocument();
  });
});
