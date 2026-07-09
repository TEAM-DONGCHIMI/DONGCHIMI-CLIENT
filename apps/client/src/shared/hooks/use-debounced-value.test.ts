import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook } from '@/test';

import { useDebouncedValue } from './use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately and delays later updates', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: '풀' },
    });

    expect(result.current).toBe('풀');

    rerender({ value: '풀무원' });

    expect(result.current).toBe('풀');

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('풀');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('풀무원');
  });

  it('keeps the latest value when updates happen before the delay ends', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: '풀' },
    });

    rerender({ value: '풀무' });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: '풀무원' });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('풀');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('풀무원');
  });
});
