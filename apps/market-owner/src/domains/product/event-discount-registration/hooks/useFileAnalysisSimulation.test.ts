import { act, renderHook } from '@/test';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fileAnalysisSimulationFrames } from '../fixtures';
import {
  FILE_ANALYSIS_SIMULATION_INTERVAL_MS,
  useFileAnalysisSimulation,
} from './useFileAnalysisSimulation';

afterEach(() => {
  vi.useRealTimers();
});

describe('useFileAnalysisSimulation', () => {
  it('advances fixture frames and completes after the final frame remains visible', async () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    const { result } = renderHook(() => useFileAnalysisSimulation({ onComplete: handleComplete }));

    expect(result.current).toBe(fileAnalysisSimulationFrames[0]);

    for (const frame of fileAnalysisSimulationFrames.slice(1)) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(FILE_ANALYSIS_SIMULATION_INTERVAL_MS);
      });

      expect(result.current).toBe(frame);
      expect(handleComplete).not.toHaveBeenCalled();
    }

    await act(async () => {
      await vi.advanceTimersByTimeAsync(FILE_ANALYSIS_SIMULATION_INTERVAL_MS);
    });

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('clears the pending frame timeout when unmounted', async () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    const { unmount } = renderHook(() => useFileAnalysisSimulation({ onComplete: handleComplete }));

    unmount();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(FILE_ANALYSIS_SIMULATION_INTERVAL_MS * 10);
    });

    expect(handleComplete).not.toHaveBeenCalled();
  });
});
