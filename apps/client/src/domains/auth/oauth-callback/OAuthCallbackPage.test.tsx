import { act, StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@/test';

import { OAuthCallbackPage } from './OAuthCallbackPage';

const navigationMocks = vi.hoisted(() => ({
  query: '',
  router: {
    replace: vi.fn(),
  },
}));

const authMocks = vi.hoisted(() => ({
  error: null as unknown,
  mutate: vi.fn<
    (
      payload: { code: string; state: string },
      options: {
        onSuccess: (response: {
          code: string;
          message: string;
          redirectTo?: string;
          success: boolean;
        }) => void;
      },
    ) => void
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => navigationMocks.router,
  useSearchParams: () => new URLSearchParams(navigationMocks.query),
}));

vi.mock('@/domains/auth/hooks/use-kakao-login-mutation', () => ({
  useKakaoLoginMutation: () => ({
    error: authMocks.error,
    mutate: authMocks.mutate,
  }),
}));

vi.mock('./components/OAuthCallbackLoading', () => ({
  OAuthCallbackLoading: () => <div data-testid='oauth-callback-loading' />,
}));

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    navigationMocks.query = 'code=authorization-code&state=oauth-state';
    navigationMocks.router.replace.mockClear();
    authMocks.error = null;
    authMocks.mutate.mockClear();
    window.history.replaceState({}, '', `/oauth/callback?${navigationMocks.query}`);
  });

  it('StrictMode에서도 로그인 요청은 한 번만 보내고 공통 Lottie loading을 표시한다', async () => {
    render(
      <StrictMode>
        <OAuthCallbackPage />
      </StrictMode>,
    );

    expect(screen.getByTestId('oauth-callback-loading')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(authMocks.mutate).toHaveBeenCalledTimes(1);
    });
  });

  it('callback query를 지운 뒤 다시 mount해도 authorization code를 재전송하지 않는다', async () => {
    const { unmount } = render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(authMocks.mutate).toHaveBeenCalledTimes(1);
    });
    unmount();
    navigationMocks.query = '';

    render(<OAuthCallbackPage />);

    expect(authMocks.mutate).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveTextContent('카카오 인증 정보를 확인할 수 없습니다.');
  });

  it('로그인 성공 응답의 안전한 redirectTo로 replace 이동한다', async () => {
    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(authMocks.mutate).toHaveBeenCalledTimes(1);
    });

    const mutationOptions = authMocks.mutate.mock.calls[0]?.[1];

    act(() => {
      mutationOptions?.onSuccess({
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
        redirectTo: '/markets/mangwon-fresh/products/402?tab=detail',
        success: true,
      });
    });

    expect(authMocks.mutate).toHaveBeenCalledWith(
      { code: 'authorization-code', state: 'oauth-state' },
      expect.any(Object),
    );
    expect(navigationMocks.router.replace).toHaveBeenCalledWith(
      '/markets/mangwon-fresh/products/402?tab=detail',
    );
    expect(window.location.pathname).toBe('/oauth/callback');
    expect(window.location.search).toBe('');
  });

  it('로그인 성공 응답의 redirectTo가 안전하지 않으면 /markets로 이동한다', async () => {
    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(authMocks.mutate).toHaveBeenCalledTimes(1);
    });

    const mutationOptions = authMocks.mutate.mock.calls[0]?.[1];

    act(() => {
      mutationOptions?.onSuccess({
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
        redirectTo: 'https://evil.example/markets',
        success: true,
      });
    });

    expect(navigationMocks.router.replace).toHaveBeenCalledWith('/markets');
  });

  it('로그인 성공 응답에 redirectTo가 없으면 /markets로 이동한다', async () => {
    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(authMocks.mutate).toHaveBeenCalledTimes(1);
    });

    const mutationOptions = authMocks.mutate.mock.calls[0]?.[1];

    act(() => {
      mutationOptions?.onSuccess({
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
        success: true,
      });
    });

    expect(navigationMocks.router.replace).toHaveBeenCalledWith('/markets');
  });

  it('code 또는 state가 없으면 로그인 요청 없이 오류를 안내한다', () => {
    navigationMocks.query = 'code=authorization-code';
    window.history.replaceState({}, '', `/oauth/callback?${navigationMocks.query}`);

    render(<OAuthCallbackPage />);

    expect(authMocks.mutate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('카카오 인증 정보를 확인할 수 없습니다.');
    expect(screen.getByRole('link', { name: '로그인 화면으로 돌아가기' })).toHaveAttribute(
      'href',
      '/login',
    );
    expect(screen.queryByTestId('oauth-callback-loading')).not.toBeInTheDocument();
  });

  it('로그인 mutation 오류가 발생하면 Lottie 대신 오류와 복귀 링크를 안내한다', () => {
    authMocks.error = new Error('login failed');

    render(<OAuthCallbackPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      '로그인에 실패했습니다. 다시 시도해 주세요.',
    );
    expect(screen.getByRole('link', { name: '로그인 화면으로 돌아가기' })).toHaveAttribute(
      'href',
      '/login',
    );
    expect(screen.queryByTestId('oauth-callback-loading')).not.toBeInTheDocument();
  });
});
