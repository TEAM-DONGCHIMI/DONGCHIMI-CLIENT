import { useRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider, useToast, type ToastIdTypes } from './ToastProvider';

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

    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveTextContent('저장되었어요');
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

    expect(screen.queryByText('저장되었어요')).not.toBeInTheDocument();
  });

  it('dismisses toast by id', () => {
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
});
