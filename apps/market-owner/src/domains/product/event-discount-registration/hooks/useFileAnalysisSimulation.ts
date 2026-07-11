import { useEffect, useState } from 'react';

import { fileAnalysisSimulationFrames } from '../fixtures';

export const FILE_ANALYSIS_SIMULATION_INTERVAL_MS = 1_000;

const LAST_SIMULATION_FRAME_INDEX = fileAnalysisSimulationFrames.length - 1;

export const useFileAnalysisSimulation = ({ onComplete }: { onComplete: () => void }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (frameIndex === LAST_SIMULATION_FRAME_INDEX) {
        onComplete();

        return;
      }

      setFrameIndex((currentFrameIndex) =>
        Math.min(currentFrameIndex + 1, LAST_SIMULATION_FRAME_INDEX),
      );
    }, FILE_ANALYSIS_SIMULATION_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [frameIndex, onComplete]);

  return fileAnalysisSimulationFrames[frameIndex] ?? fileAnalysisSimulationFrames[0];
};
