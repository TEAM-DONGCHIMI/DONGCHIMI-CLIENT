import { useRef } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider, useToast, type ToastIdTypes } from './ToastProvider';
import { toastExitAnimationDurationMs } from './ToastViewport.css';

const CompletedToastLauncher = () => {
  const toast = useToast();

  return (
    <button onClick={() => toast.completed('저장되었어요')} type='button'>
      완료 토스트 열기
    </button>
  );
};

const ManualDismissToastLauncher = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastIdTypes | null>(null);

  const openToast = () => {
    toastIdRef.current = toast.error('저장에 실패했어요', { durationMs: null });
  };

  const dismissToast = () => {
    if (toastIdRef.current === null) {
      return;
    }

    toast.dismiss(toastIdRef.current);
  };

  return (
    <>
      <button onClick={openToast} type='button'>
        에러 토스트 열기
      </button>
      <button onClick={dismissToast} type='button'>
        에러 토스트 닫기
      </button>
    </>
  );
};

const MultipleToastLauncher = () => {
  const toast = useToast();

  const openToasts = () => {
    toast.completed('첫 번째 토스트', { durationMs: null });
    toast.completed('두 번째 토스트', { durationMs: null });
  };

  return (
    <button onClick={openToasts} type='button'>
      여러 토스트 열기
    </button>
  );
};

const StableIdToastLauncher = () => {
  const toast = useToast();

  const openToasts = () => {
    toast.completed('교체 전 토스트', { durationMs: null, id: 'stable-toast' });
    toast.completed('교체 후 토스트', { durationMs: null, id: 'stable-toast' });
  };

  return (
    <button onClick={openToasts} type='button'>
      동일 id 토스트 열기
    </button>
  );
};

const ClearableToastLauncher = () => {
  const toast = useToast();

  const openToasts = () => {
    toast.completed('첫 번째 삭제 대상 토스트', { durationMs: null });
    toast.error('두 번째 삭제 대상 토스트', { durationMs: null });
  };

  return (
    <>
      <button onClick={openToasts} type='button'>
        삭제 대상 토스트 열기
      </button>
      <button onClick={() => toast.clear()} type='button'>
        토스트 모두 지우기
      </button>
    </>
  );
};

const TrimmedToastLauncher = () => {
  const toast = useToast();

  const openToasts = () => {
    toast.completed('첫 번째 토스트', { durationMs: null, id: 'first-toast' });
    toast.completed('두 번째 토스트', { durationMs: null, id: 'second-toast' });
  };

  return (
    <>
      <button onClick={openToasts} type='button'>
        제한 토스트 열기
      </button>
      <button onClick={() => toast.dismiss('second-toast')} type='button'>
        두 번째 토스트 닫기
      </button>
    </>
  );
};

afterEach(() => {
  vi.useRealTimers();
});

describe('ToastProvider', () => {
  it('renders completed toast through useToast', () => {
    render(
      <ToastProvider>
        <CompletedToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '완료 토스트 열기' }));

    const toast = screen.getByRole('status');
    const viewport = screen.getByRole('region', { name: '토스트 알림' });

    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveAttribute('data-placement', 'bottom-center');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveTextContent('저장되었어요');
  });

  it('uses the browser top layer when the Popover API is available', () => {
    const originalShowPopover = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'showPopover',
    );
    const showPopover = vi.fn();

    Object.defineProperty(HTMLElement.prototype, 'showPopover', {
      configurable: true,
      value: showPopover,
    });

    try {
      render(
        <ToastProvider>
          <CompletedToastLauncher />
        </ToastProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: '완료 토스트 열기' }));

      const viewport = document.querySelector('[aria-label="토스트 알림"]');

      expect(viewport).toHaveAttribute('popover', 'manual');
      expect(showPopover).toHaveBeenCalledOnce();
    } finally {
      if (originalShowPopover === undefined) {
        Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
      } else {
        Object.defineProperty(HTMLElement.prototype, 'showPopover', originalShowPopover);
      }
    }
  });

  it('applies string viewport offset without center correction', () => {
    render(
      <ToastProvider offset='2.4rem' placement='top-center'>
        <CompletedToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '완료 토스트 열기' }));

    const viewport = screen.getByRole('region', { name: '토스트 알림' });

    expect(viewport).toHaveStyle({
      '--toast-viewport-offset-x': '2.4rem',
      '--toast-viewport-offset-y': '2.4rem',
    });
    expect(viewport).not.toHaveStyle({
      '--toast-viewport-center-offset-x': '2.4rem',
    });
  });

  it('applies object viewport offset as center correction', () => {
    render(
      <ToastProvider offset={{ x: '145px', y: '2rem' }} placement='top-center'>
        <CompletedToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '완료 토스트 열기' }));

    const viewport = screen.getByRole('region', { name: '토스트 알림' });

    expect(viewport).toHaveStyle({
      '--toast-viewport-center-offset-x': '145px',
      '--toast-viewport-offset-x': '145px',
      '--toast-viewport-offset-y': '2rem',
    });
  });

  it('renders toast into a custom portal container', () => {
    const portalContainer = document.createElement('section');
    document.body.appendChild(portalContainer);

    const { unmount } = render(
      <ToastProvider portalContainer={portalContainer}>
        <CompletedToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '완료 토스트 열기' }));

    expect(
      within(portalContainer).getByRole('region', { name: '토스트 알림' }),
    ).toBeInTheDocument();
    expect(within(portalContainer).getByRole('status')).toHaveTextContent('저장되었어요');
    expect(
      within(portalContainer).getByRole('region', { name: '토스트 알림' }),
    ).not.toHaveAttribute('popover');

    unmount();
    portalContainer.remove();
  });

  it('auto dismisses toast after the default duration', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <CompletedToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '완료 토스트 열기' }));

    expect(screen.getByText('저장되었어요')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('저장되었어요')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(toastExitAnimationDurationMs);
    });

    expect(screen.queryByText('저장되었어요')).not.toBeInTheDocument();
  });

  it('dismisses toast by id', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ManualDismissToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '에러 토스트 열기' }));

    const toast = screen.getByRole('alert');

    expect(toast).toHaveAttribute('aria-live', 'assertive');
    expect(toast).toHaveTextContent('저장에 실패했어요');

    fireEvent.click(screen.getByRole('button', { name: '에러 토스트 닫기' }));

    expect(screen.getByText('저장에 실패했어요')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(toastExitAnimationDurationMs);
    });

    expect(screen.queryByText('저장에 실패했어요')).not.toBeInTheDocument();
  });

  it('limits visible toast count', () => {
    render(
      <ToastProvider maxVisibleCount={1}>
        <MultipleToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '여러 토스트 열기' }));

    expect(screen.queryByText('첫 번째 토스트')).not.toBeInTheDocument();
    expect(screen.getByText('두 번째 토스트')).toBeInTheDocument();
  });

  it('replaces toast with the same stable id', () => {
    render(
      <ToastProvider>
        <StableIdToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '동일 id 토스트 열기' }));

    expect(screen.queryByText('교체 전 토스트')).not.toBeInTheDocument();
    expect(screen.getByText('교체 후 토스트')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('clears all toasts', () => {
    render(
      <ToastProvider>
        <ClearableToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '삭제 대상 토스트 열기' }));

    expect(screen.getByText('첫 번째 삭제 대상 토스트')).toBeInTheDocument();
    expect(screen.getByText('두 번째 삭제 대상 토스트')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '토스트 모두 지우기' }));

    expect(screen.queryByText('첫 번째 삭제 대상 토스트')).not.toBeInTheDocument();
    expect(screen.queryByText('두 번째 삭제 대상 토스트')).not.toBeInTheDocument();
  });

  it('removes excess toast from state when visible count is exceeded', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider maxVisibleCount={1}>
        <TrimmedToastLauncher />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '제한 토스트 열기' }));

    expect(screen.queryByText('첫 번째 토스트')).not.toBeInTheDocument();
    expect(screen.getByText('두 번째 토스트')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '두 번째 토스트 닫기' }));

    act(() => {
      vi.advanceTimersByTime(toastExitAnimationDurationMs);
    });

    expect(screen.queryByText('첫 번째 토스트')).not.toBeInTheDocument();
    expect(screen.queryByText('두 번째 토스트')).not.toBeInTheDocument();
  });
});
