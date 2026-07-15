import { API_ENDPOINTS } from '@dongchimi/shared/api';
import { describe, expect, it, vi } from 'vitest';

import { httpClient, type ApiError } from '@/shared/api';
import type * as SharedApiModule from '@/shared/api';

import { subscribeProductImportProgress } from './subscribe-product-import-progress';

vi.mock('@/shared/api', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof SharedApiModule;

  return {
    ...actual,
    httpClient: {
      stream: vi.fn(),
    },
  };
});

const mockedHttpClientStream = vi.mocked(httpClient.stream);
const encoder = new TextEncoder();

const createChunkedResponse = (chunks: string[]) => {
  return new Response(
    new ReadableStream({
      start(controller) {
        chunks.forEach((chunk) => {
          controller.enqueue(encoder.encode(chunk));
        });
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    },
  );
};

describe('subscribeProductImportProgress', () => {
  it('parses chunked progress and completed events', async () => {
    const onEvent = vi.fn();
    const abortController = new AbortController();
    const progressData = {
      jobId: 'job-123',
      status: 'IN_PROGRESS',
      progress: 72,
      remainingSeconds: 10,
      currentStep: 'NAME_EXTRACTION',
      steps: [
        { step: 'FILE_UPLOAD', status: 'COMPLETED' },
        { step: 'NAME_EXTRACTION', status: 'IN_PROGRESS' },
        { step: 'PRICE_EXTRACTION', status: 'PENDING' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'PENDING' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ],
    };
    const completedData = {
      jobId: 'job-123',
      status: 'COMPLETED',
      progress: 100,
      totalCount: 128,
      successCount: 116,
      failCount: 12,
    };
    const streamText = [
      ': keep-alive\r\n\r\n',
      `event: progress\r\ndata: ${JSON.stringify(progressData).slice(0, 50)}`,
      `${JSON.stringify(progressData).slice(50)}\r\n\r\n`,
      `event: completed\r\ndata: ${JSON.stringify(completedData)}\r\n\r\n`,
    ];

    mockedHttpClientStream.mockResolvedValueOnce(createChunkedResponse(streamText));

    await subscribeProductImportProgress({
      jobId: 'job-123',
      marketId: 12,
      onEvent,
      signal: abortController.signal,
    });

    expect(mockedHttpClientStream).toHaveBeenCalledWith(
      API_ENDPOINTS.owner.products.importProgress(12, 'job-123'),
      expect.objectContaining({
        credentials: 'include',
        headers: {
          Accept: 'text/event-stream',
        },
        signal: abortController.signal,
        timeout: false,
      }),
    );
    expect(onEvent).toHaveBeenNthCalledWith(1, { data: progressData, type: 'progress' });
    expect(onEvent).toHaveBeenNthCalledWith(2, { data: completedData, type: 'completed' });
  });

  it('ignores unknown event types and handles canceled as terminal', async () => {
    const onEvent = vi.fn();
    const canceledData = {
      jobId: 'job-123',
      status: 'CANCELED',
      progress: 24,
    };

    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse([
        'event: heartbeat\ndata: {}\n\n',
        `event: canceled\ndata: ${JSON.stringify(canceledData)}\n\n`,
      ]),
    );

    await subscribeProductImportProgress({
      jobId: 'job-123',
      marketId: 12,
      onEvent,
      signal: new AbortController().signal,
    });

    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalledWith({ data: canceledData, type: 'canceled' });
  });

  it('infers event types from default SSE message data status', async () => {
    const onEvent = vi.fn();
    const pendingData = {
      jobId: 'job-pending',
      status: 'PENDING',
      progress: 0,
      remainingSeconds: null,
      currentStep: null,
      steps: [
        { step: 'FILE_UPLOAD', status: 'PENDING' },
        { step: 'NAME_EXTRACTION', status: 'PENDING' },
        { step: 'PRICE_EXTRACTION', status: 'PENDING' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'PENDING' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ],
    };
    const progressData = {
      jobId: 'job-123',
      status: 'IN_PROGRESS',
      progress: 30,
      remainingSeconds: 18,
      currentStep: 'PRICE_EXTRACTION',
      steps: [
        { step: 'FILE_UPLOAD', status: 'COMPLETED' },
        { step: 'NAME_EXTRACTION', status: 'COMPLETED' },
        { step: 'PRICE_EXTRACTION', status: 'IN_PROGRESS' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'PENDING' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ],
    };
    const completedData = {
      jobId: 'job-123',
      status: 'COMPLETED',
      progress: 100,
      totalCount: 12,
      successCount: 10,
      failCount: 2,
    };

    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse([
        `data: ${JSON.stringify(pendingData)}\n\n`,
        `data: ${JSON.stringify(progressData)}\n\n`,
        `event: message\ndata: ${JSON.stringify(completedData)}\n\n`,
      ]),
    );

    await subscribeProductImportProgress({
      jobId: 'job-123',
      marketId: 12,
      onEvent,
      signal: new AbortController().signal,
    });

    expect(onEvent).toHaveBeenNthCalledWith(1, { data: pendingData, type: 'progress' });
    expect(onEvent).toHaveBeenNthCalledWith(2, { data: progressData, type: 'progress' });
    expect(onEvent).toHaveBeenNthCalledWith(3, { data: completedData, type: 'completed' });
  });

  it('ignores default SSE message timeout payloads', async () => {
    const onEvent = vi.fn();
    const progressData = {
      jobId: 'job-123',
      status: 'IN_PROGRESS',
      progress: 0,
      currentStep: null,
      remainingSeconds: null,
      steps: [
        { step: 'FILE_UPLOAD', status: 'PENDING' },
        { step: 'NAME_EXTRACTION', status: 'PENDING' },
        { step: 'PRICE_EXTRACTION', status: 'PENDING' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'PENDING' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ],
    };
    const completedData = {
      jobId: 'job-123',
      status: 'COMPLETED',
      progress: 100,
      totalCount: 0,
      successCount: 0,
      failCount: 0,
    };

    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse([
        'data: {"timeout":0}\n\n',
        'event: message\ndata: {"timeout":0}\n\n',
        `data: ${JSON.stringify(progressData)}\n\n`,
        `data: ${JSON.stringify(completedData)}\n\n`,
      ]),
    );

    await subscribeProductImportProgress({
      jobId: 'job-123',
      marketId: 12,
      onEvent,
      signal: new AbortController().signal,
    });

    expect(onEvent).toHaveBeenNthCalledWith(1, { data: progressData, type: 'progress' });
    expect(onEvent).toHaveBeenNthCalledWith(2, { data: completedData, type: 'completed' });
    expect(onEvent).toHaveBeenCalledTimes(2);
  });

  it('ignores timeout payloads even when they are sent with a known event name', async () => {
    const onEvent = vi.fn();
    const completedData = {
      jobId: 'job-123',
      status: 'COMPLETED',
      progress: 100,
      totalCount: 0,
      successCount: 0,
      failCount: 0,
    };

    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse([
        'event: progress\ndata: {"timeout":0}\n\n',
        `event: completed\ndata: ${JSON.stringify(completedData)}\n\n`,
      ]),
    );

    await subscribeProductImportProgress({
      jobId: 'job-123',
      marketId: 12,
      onEvent,
      signal: new AbortController().signal,
    });

    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalledWith({ data: completedData, type: 'completed' });
  });

  it('accepts initial progress events without optional current step metadata', async () => {
    const onEvent = vi.fn();
    const initialProgressData = {
      jobId: 'job-123',
      status: 'PENDING',
      progress: 0,
      currentStep: null,
      remainingSeconds: null,
      steps: [
        { step: 'FILE_UPLOAD', status: 'PENDING' },
        { step: 'NAME_EXTRACTION', status: 'PENDING' },
        { step: 'PRICE_EXTRACTION', status: 'PENDING' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'PENDING' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ],
    };
    const completedData = {
      jobId: 'job-123',
      status: 'COMPLETED',
      progress: 100,
      totalCount: 0,
      successCount: 0,
      failCount: 0,
    };

    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse([
        `event: progress\ndata: ${JSON.stringify(initialProgressData)}\n\n`,
        `event: completed\ndata: ${JSON.stringify(completedData)}\n\n`,
      ]),
    );

    await subscribeProductImportProgress({
      jobId: 'job-123',
      marketId: 12,
      onEvent,
      signal: new AbortController().signal,
    });

    expect(onEvent).toHaveBeenNthCalledWith(1, {
      data: initialProgressData,
      type: 'progress',
    });
    expect(onEvent).toHaveBeenNthCalledWith(2, { data: completedData, type: 'completed' });
  });

  it('rejects malformed event data as an API validation error', async () => {
    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse(['event: progress\ndata: {"jobId":\n\n']),
    );

    await expect(
      subscribeProductImportProgress({
        jobId: 'job-123',
        marketId: 12,
        onEvent: vi.fn(),
        signal: new AbortController().signal,
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<ApiError>>({
        message: '분석 진행 응답을 해석하지 못했습니다.',
        type: 'validation',
      }),
    );
  });

  it('rejects when the stream closes before a terminal event', async () => {
    mockedHttpClientStream.mockResolvedValueOnce(
      createChunkedResponse([
        `event: progress\ndata: ${JSON.stringify({
          jobId: 'job-123',
          status: 'IN_PROGRESS',
          progress: 10,
          remainingSeconds: 20,
          currentStep: 'FILE_UPLOAD',
          steps: [{ step: 'FILE_UPLOAD', status: 'IN_PROGRESS' }],
        })}\n\n`,
      ]),
    );

    await expect(
      subscribeProductImportProgress({
        jobId: 'job-123',
        marketId: 12,
        onEvent: vi.fn(),
        signal: new AbortController().signal,
      }),
    ).rejects.toMatchObject({
      message: '분석 진행 연결이 예기치 않게 종료되었습니다.',
      type: 'network',
    });
  });
});
