import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';

import { OAuthCallbackLoading } from './OAuthCallbackLoading';
import * as S from './OAuthCallbackLoading.css';

const dynamicMocks = vi.hoisted(() => ({
  state: 'ready' as 'error' | 'loading' | 'ready',
}));

vi.mock('next/dynamic', () => ({
  default: (_loader: () => Promise<unknown>, options: { loading?: () => ReactNode }) => {
    return () => {
      if (dynamicMocks.state === 'error') {
        throw new Error('Lottie chunk failed');
      }

      if (dynamicMocks.state === 'loading') {
        return options.loading?.() ?? null;
      }

      return <span aria-hidden='true' data-testid='oauth-callback-lottie' />;
    };
  },
}));

describe('OAuthCallbackLoading', () => {
  beforeEach(() => {
    dynamicMocks.state = 'ready';
  });

  it('가시 문구 없이 Lottie와 보조기술용 로그인 처리 상태를 제공한다', () => {
    const { container } = render(<OAuthCallbackLoading />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveTextContent('로그인 정보를 확인하고 있습니다.');
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('로그인 정보를 확인하고 있습니다.')).toHaveClass(
      S.visuallyHiddenClassName,
    );
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('Lottie chunk를 불러오는 동안 정적 spinner를 표시한다', () => {
    dynamicMocks.state = 'loading';

    const { container } = render(<OAuthCallbackLoading />);

    expect(container.getElementsByClassName(S.fallbackSpinnerClassName)).toHaveLength(1);
  });

  it('Lottie chunk 오류를 정적 spinner로 격리해 callback 상태를 유지한다', () => {
    dynamicMocks.state = 'error';
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const { container } = render(<OAuthCallbackLoading />);

      expect(container.getElementsByClassName(S.fallbackSpinnerClassName)).toHaveLength(1);
      expect(screen.getByRole('status')).toHaveTextContent('로그인 정보를 확인하고 있습니다.');
    } finally {
      consoleError.mockRestore();
    }
  });
});
