import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, waitFor } from '@/test';

import { LoginRequiredToast } from './LoginRequiredToast';

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
}));

vi.mock('@dongchimi/shared/toast', () => ({
  useToast: () => toastMocks,
}));

describe('LoginRequiredToast', () => {
  beforeEach(() => {
    toastMocks.error.mockClear();
    window.history.replaceState(
      {},
      '',
      '/login?reason=auth-required&returnTo=%2Fmarkets%2Fmangwon-fresh',
    );
  });

  it('StrictMode에서도 인증 필요 Toast를 정확히 한 번 표시하고 reason만 소비한다', async () => {
    render(
      <StrictMode>
        <LoginRequiredToast enabled />
      </StrictMode>,
    );

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledTimes(1);
    });
    expect(toastMocks.error).toHaveBeenCalledWith('서비스 이용을 위해 로그인이 필요해요.', {
      id: 'auth-required',
    });
    expect(window.location.search).toBe('?returnTo=%2Fmarkets%2Fmangwon-fresh');
  });

  it('직접 로그인 진입에서는 Toast와 URL을 변경하지 않는다', () => {
    window.history.replaceState({}, '', '/login?returnTo=%2Fmarkets');

    render(<LoginRequiredToast enabled={false} />);

    expect(toastMocks.error).not.toHaveBeenCalled();
    expect(window.location.search).toBe('?returnTo=%2Fmarkets');
  });
});
