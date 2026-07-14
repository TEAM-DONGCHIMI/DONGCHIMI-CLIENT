import { act, renderHook } from '@/test';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api';

import type { SubscribeProductImportProgressTypes } from '../api';
import {
  MAX_CONNECTION_ATTEMPTS,
  RECONNECT_DELAY_MS,
  useProductImportProgress,
} from './use-product-import-progress';

afterEach(() => {
  vi.useRealTimers();
});

const defaultCallbacks = {
  onCanceled: vi.fn(),
  onCompleted: vi.fn(),
  onConnectionError: vi.fn(),
  onFailed: vi.fn(),
};

describe('useProductImportProgress', () => {
  it('reconnects after transport failures and applies the next progress event', async () => {
    vi.useFakeTimers();
    const subscribe = vi
      .fn<SubscribeProductImportProgressTypes>()
      .mockRejectedValueOnce(new ApiError({ message: 'first disconnect', type: 'network' }))
      .mockRejectedValueOnce(new ApiError({ message: 'second disconnect', type: 'network' }))
      .mockImplementationOnce(async ({ onEvent, signal }) => {
        onEvent({
          data: {
            jobId: 'job-123',
            status: 'IN_PROGRESS',
            progress: 72,
            remainingSeconds: 10,
            currentStep: 'NAME_EXTRACTION',
            steps: [
              { step: 'FILE_UPLOAD', status: 'COMPLETED' },
              { step: 'NAME_EXTRACTION', status: 'IN_PROGRESS' },
            ],
          },
          type: 'progress',
        });

        await new Promise<void>((resolve) => {
          signal.addEventListener('abort', () => resolve(), { once: true });
        });
      });
    const { result } = renderHook(() =>
      useProductImportProgress({
        ...defaultCallbacks,
        jobId: 'job-123',
        marketId: 12,
        subscribe,
      }),
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS * 2);
    });

    expect(subscribe).toHaveBeenCalledTimes(3);
    expect(result.current.progressPercentage).toBe(72);
    expect(result.current.steps[1]).toMatchObject({
      id: 'NAME_EXTRACTION',
      status: 'processing',
      title: '상품명 등록',
    });
  });

  it('reports the last connection error after the retry limit', async () => {
    vi.useFakeTimers();
    const connectionError = new ApiError({ message: 'connection failed', type: 'network' });
    const onConnectionError = vi.fn();
    const subscribe = vi
      .fn<SubscribeProductImportProgressTypes>()
      .mockRejectedValue(connectionError);

    renderHook(() =>
      useProductImportProgress({
        ...defaultCallbacks,
        jobId: 'job-123',
        marketId: 12,
        onConnectionError,
        subscribe,
      }),
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS * MAX_CONNECTION_ATTEMPTS);
    });

    expect(subscribe).toHaveBeenCalledTimes(MAX_CONNECTION_ATTEMPTS);
    expect(onConnectionError).toHaveBeenCalledOnce();
    expect(onConnectionError).toHaveBeenCalledWith(connectionError);
  });

  it('does not reconnect for non-network errors', async () => {
    const validationError = new ApiError({
      message: 'invalid progress event',
      type: 'validation',
    });
    const onConnectionError = vi.fn();
    const subscribe = vi
      .fn<SubscribeProductImportProgressTypes>()
      .mockRejectedValue(validationError);

    renderHook(() =>
      useProductImportProgress({
        ...defaultCallbacks,
        jobId: 'job-123',
        marketId: 12,
        onConnectionError,
        subscribe,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(subscribe).toHaveBeenCalledOnce();
    expect(onConnectionError).toHaveBeenCalledWith(validationError);
  });

  it('aborts the active subscription when unmounted', () => {
    let subscriptionSignal: AbortSignal | undefined;
    const subscribe = vi.fn<SubscribeProductImportProgressTypes>(async ({ signal }) => {
      subscriptionSignal = signal;
    });
    const { unmount } = renderHook(() =>
      useProductImportProgress({
        ...defaultCallbacks,
        jobId: 'job-123',
        marketId: 12,
        subscribe,
      }),
    );

    unmount();

    expect(subscriptionSignal?.aborted).toBe(true);
  });
});
