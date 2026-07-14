import { API_ENDPOINTS, type ApiPathParamTypes, type z } from '@dongchimi/shared/api';

import { ApiError, httpClient } from '@/shared/api';

import {
  productImportCanceledDataSchema,
  productImportCompletedDataSchema,
  productImportFailedDataSchema,
  productImportProgressDataSchema,
  type ProductImportProgressEventTypes,
} from '../model';
import { createSseEventParser, type ParsedSseEventTypes } from '../utils/sse-event-parser';

const TERMINAL_EVENT_TYPES = new Set(['canceled', 'completed', 'failed']);

const parseEventData = <DataTypes>(schema: z.ZodType<DataTypes>, event: ParsedSseEventTypes) => {
  let data: unknown;

  try {
    data = JSON.parse(event.data) as unknown;
  } catch (error) {
    throw new ApiError({
      cause: error,
      details: event.data,
      message: '분석 진행 응답을 해석하지 못했습니다.',
      type: 'validation',
    });
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError({
      details: result.error,
      message: '분석 진행 응답 형식이 올바르지 않습니다.',
      type: 'validation',
    });
  }

  return result.data;
};

export const parseProductImportProgressEvent = (
  event: ParsedSseEventTypes,
): ProductImportProgressEventTypes | undefined => {
  switch (event.event) {
    case 'progress':
      return {
        data: parseEventData(productImportProgressDataSchema, event),
        type: 'progress',
      };
    case 'completed':
      return {
        data: parseEventData(productImportCompletedDataSchema, event),
        type: 'completed',
      };
    case 'failed':
      return {
        data: parseEventData(productImportFailedDataSchema, event),
        type: 'failed',
      };
    case 'canceled':
      return {
        data: parseEventData(productImportCanceledDataSchema, event),
        type: 'canceled',
      };
    default:
      return undefined;
  }
};

export interface SubscribeProductImportProgressParams {
  jobId: string;
  marketId: ApiPathParamTypes;
  onEvent: (event: ProductImportProgressEventTypes) => void;
  signal: AbortSignal;
}

export type SubscribeProductImportProgressTypes = (
  params: SubscribeProductImportProgressParams,
) => Promise<void>;

export const subscribeProductImportProgress: SubscribeProductImportProgressTypes = async ({
  jobId,
  marketId,
  onEvent,
  signal,
}) => {
  const endpoint = API_ENDPOINTS.owner.products.importProgress(marketId, jobId);
  const response = await httpClient.stream(endpoint, {
    credentials: 'include',
    headers: {
      Accept: 'text/event-stream',
    },
    signal,
    timeout: false,
  });

  if (!response.body) {
    throw new ApiError({
      message: '분석 진행 스트림을 열지 못했습니다.',
      type: 'network',
    });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let isTerminalEventReceived = false;
  const parser = createSseEventParser((rawEvent) => {
    if (isTerminalEventReceived) {
      return;
    }

    const event = parseProductImportProgressEvent(rawEvent);

    if (!event) {
      return;
    }

    isTerminalEventReceived = TERMINAL_EVENT_TYPES.has(event.type);
    onEvent(event);
  });

  try {
    while (!isTerminalEventReceived) {
      const { done, value } = await reader.read();

      if (done) {
        parser.push(decoder.decode());
        parser.flush();
        break;
      }

      parser.push(decoder.decode(value, { stream: true }));
    }

    if (!isTerminalEventReceived && !signal.aborted) {
      throw new ApiError({
        message: '분석 진행 연결이 예기치 않게 종료되었습니다.',
        type: 'network',
      });
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
};
