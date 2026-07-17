import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test';

import { OAuthCallbackLottie } from './OAuthCallbackLottie';
import * as S from './OAuthCallbackLoading.css';

const lottieMocks = vi.hoisted(() => ({
  listeners: new Map<string, () => void>(),
  pause: vi.fn(),
  play: vi.fn(),
  setWasmUrl: vi.fn(),
}));

vi.mock('@lottiefiles/dotlottie-web/dotlottie-player.wasm', () => ({
  default: '/_next/static/media/dotlottie-player.test.wasm',
}));

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: ({
    'aria-hidden': ariaHidden,
    autoplay,
    className,
    dotLottieRefCallback,
    loop,
    src,
  }: {
    'aria-hidden'?: boolean | 'true' | 'false';
    autoplay?: boolean;
    className?: string;
    dotLottieRefCallback?: (
      dotLottie: {
        addEventListener: (type: string, listener: () => void) => void;
        pause: () => void;
        play: () => void;
        removeEventListener: (type: string) => void;
      } | null,
    ) => void;
    loop?: boolean;
    src?: string;
  }) => (
    <span
      aria-hidden={ariaHidden}
      className={className}
      data-autoplay={autoplay}
      data-loop={loop}
      data-src={src}
      data-testid='oauth-callback-lottie'
      ref={(element) => {
        dotLottieRefCallback?.(
          element
            ? {
                addEventListener: (type: string, listener: () => void) => {
                  lottieMocks.listeners.set(type, listener);
                },
                pause: lottieMocks.pause,
                play: lottieMocks.play,
                removeEventListener: (type: string) => {
                  lottieMocks.listeners.delete(type);
                },
              }
            : null,
        );
      }}
    />
  ),
  setWasmUrl: lottieMocks.setWasmUrl,
}));

const stubReducedMotion = (initialMatches: boolean) => {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  const mediaQuery = {
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener);
    },
    get matches() {
      return matches;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    removeEventListener: (_type: string, listener: () => void) => {
      listeners.delete(listener);
    },
  } as unknown as MediaQueryList;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => mediaQuery),
    writable: true,
  });

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      listeners.forEach((listener) => listener());
    },
  };
};

describe('OAuthCallbackLottie', () => {
  beforeEach(() => {
    lottieMocks.listeners.clear();
    lottieMocks.pause.mockClear();
    lottieMocks.play.mockClear();
    stubReducedMotion(false);
  });

  it('번들된 WASM과 spinner asset으로 장식용 Lottie를 반복 재생한다', () => {
    render(<OAuthCallbackLottie />);

    expect(lottieMocks.setWasmUrl).toHaveBeenCalledWith(
      '/_next/static/media/dotlottie-player.test.wasm',
    );
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute(
      'data-src',
      '/lottie/spinner.lottie',
    );
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute('data-autoplay', 'true');
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute('data-loop', 'true');
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute('aria-hidden', 'true');
    expect(lottieMocks.play).toHaveBeenCalled();
  });

  it('reduced-motion 환경에서는 Lottie를 자동·반복 재생하지 않는다', () => {
    stubReducedMotion(true);

    const { container } = render(<OAuthCallbackLottie />);

    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute('data-autoplay', 'false');
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveAttribute('data-loop', 'false');
    expect(screen.getByTestId('oauth-callback-lottie')).toHaveClass(S.hiddenLottieClassName);
    expect(container.getElementsByClassName(S.fallbackSpinnerClassName)).toHaveLength(1);
    expect(lottieMocks.pause).toHaveBeenCalled();
  });

  it('실행 중 reduced-motion 설정이 바뀌면 animation을 즉시 정지하고 다시 재생한다', () => {
    const reducedMotion = stubReducedMotion(false);

    render(<OAuthCallbackLottie />);
    lottieMocks.pause.mockClear();
    lottieMocks.play.mockClear();

    act(() => {
      reducedMotion.setMatches(true);
    });

    expect(lottieMocks.pause).toHaveBeenCalled();

    act(() => {
      reducedMotion.setMatches(false);
    });

    expect(lottieMocks.play).toHaveBeenCalled();
  });

  it.each(['loadError', 'renderError'])('%s 이벤트가 발생하면 정적 spinner로 전환한다', (type) => {
    const { container } = render(<OAuthCallbackLottie />);

    act(() => {
      lottieMocks.listeners.get(type)?.();
    });

    expect(screen.queryByTestId('oauth-callback-lottie')).not.toBeInTheDocument();
    expect(container.getElementsByClassName(S.fallbackSpinnerClassName)).toHaveLength(1);
  });
});
