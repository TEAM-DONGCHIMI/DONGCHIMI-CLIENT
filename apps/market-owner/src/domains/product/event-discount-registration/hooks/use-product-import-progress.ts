import { useEffect, useState } from 'react';

import { isApiError } from '@/shared/api';
import type { ProcessingStepProps } from '@/shared/components';

import { subscribeProductImportProgress, type SubscribeProductImportProgressTypes } from '../api';
import { fileAnalysisProgressFixtures } from '../fixtures';
import {
  calculateProductImportProgressPercentage,
  mapProductImportSteps,
  type ProductImportCanceledDataTypes,
  type ProductImportCompletedDataTypes,
  type ProductImportFailedDataTypes,
} from '../model';

const MAX_CONNECTION_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 1_000;

interface ProductImportProgressStateTypes {
  progressPercentage: number;
  steps: ProcessingStepProps['steps'];
}

interface UseProductImportProgressParams {
  jobId: string;
  marketId: number | string;
  onCanceled: (data: ProductImportCanceledDataTypes) => void;
  onCompleted: (data: ProductImportCompletedDataTypes) => void;
  onConnectionError: (error: unknown) => void;
  onFailed: (data: ProductImportFailedDataTypes) => void;
  subscribe?: SubscribeProductImportProgressTypes;
}

const waitForReconnect = (signal: AbortSignal) => {
  if (signal.aborted) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };

    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, RECONNECT_DELAY_MS);
    signal.addEventListener('abort', handleAbort, { once: true });
  });
};

export const useProductImportProgress = ({
  jobId,
  marketId,
  onCanceled,
  onCompleted,
  onConnectionError,
  onFailed,
  subscribe = subscribeProductImportProgress,
}: UseProductImportProgressParams) => {
  const [state, setState] = useState<ProductImportProgressStateTypes>(
    fileAnalysisProgressFixtures.pending,
  );

  useEffect(() => {
    const abortController = new AbortController();
    let isTerminal = false;

    const connect = async () => {
      for (let attempt = 1; attempt <= MAX_CONNECTION_ATTEMPTS; attempt += 1) {
        if (abortController.signal.aborted) {
          return;
        }

        try {
          await subscribe({
            jobId,
            marketId,
            onEvent: (event) => {
              if (isTerminal || abortController.signal.aborted) {
                return;
              }

              switch (event.type) {
                case 'progress':
                  setState({
                    progressPercentage: calculateProductImportProgressPercentage(event.data.steps),
                    steps: mapProductImportSteps(event.data.steps),
                  });
                  return;
                case 'completed':
                  isTerminal = true;
                  setState((currentState) => ({
                    progressPercentage: event.data.progress,
                    steps: currentState.steps.map((step) => ({
                      ...step,
                      status: 'completed',
                      statusLabel: undefined,
                    })),
                  }));
                  onCompleted(event.data);
                  return;
                case 'failed':
                  isTerminal = true;
                  onFailed(event.data);
                  return;
                case 'canceled':
                  isTerminal = true;
                  onCanceled(event.data);
              }
            },
            signal: abortController.signal,
          });

          if (isTerminal || abortController.signal.aborted) {
            return;
          }
        } catch (error) {
          if (isTerminal || abortController.signal.aborted) {
            return;
          }

          const isRetryableConnectionError = isApiError(error) && error.type === 'network';

          if (!isRetryableConnectionError || attempt === MAX_CONNECTION_ATTEMPTS) {
            onConnectionError(error);
            return;
          }
        }

        await waitForReconnect(abortController.signal);
      }
    };

    void connect();

    return () => {
      abortController.abort();
    };
  }, [jobId, marketId, onCanceled, onCompleted, onConnectionError, onFailed, subscribe]);

  return state;
};

export { MAX_CONNECTION_ATTEMPTS, RECONNECT_DELAY_MS };
