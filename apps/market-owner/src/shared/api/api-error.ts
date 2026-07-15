import { HTTPError, NetworkError, TimeoutError } from 'ky';

import { HTTP_STATUS, RESPONSE_MESSAGE } from './http-status';

export type ApiErrorCategoryTypes =
  | 'auth'
  | 'client'
  | 'configuration'
  | 'network'
  | 'server'
  | 'unknown'
  | 'validation';

interface ApiErrorOptions {
  code?: string;
  details?: unknown;
  message: string;
  status?: number;
  type: ApiErrorCategoryTypes;
  cause?: unknown;
}

export class ApiError extends Error {
  code?: string;
  details?: unknown;
  status?: number;
  type: ApiErrorCategoryTypes;

  constructor({ cause, code, details, message, status, type }: ApiErrorOptions) {
    super(message, { cause });
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
    this.type = type;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const getStringField = (value: unknown, fieldName: string) => {
  if (!isRecord(value)) {
    return undefined;
  }

  const fieldValue = value[fieldName];

  return typeof fieldValue === 'string' ? fieldValue : undefined;
};

const parseErrorBody = (body: unknown) => {
  if (typeof body !== 'string') {
    return body;
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    return body;
  }
};

const getSafeErrorMessage = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const message = value.trim();

  return message === '' || message.startsWith('<') ? undefined : message;
};

const getResponseMessage = (status: number) => {
  return status >= HTTP_STATUS.SERVER_ERROR
    ? (RESPONSE_MESSAGE[status] ?? RESPONSE_MESSAGE[HTTP_STATUS.SERVER_ERROR])
    : RESPONSE_MESSAGE[status];
};

const getErrorType = (status: number): ApiErrorCategoryTypes => {
  if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
    return 'auth';
  }

  if (
    status === HTTP_STATUS.BAD_REQUEST ||
    status === HTTP_STATUS.CONFLICT ||
    status === HTTP_STATUS.UNPROCESSABLE_ENTITY
  ) {
    return 'validation';
  }

  if (status >= HTTP_STATUS.SERVER_ERROR) {
    return 'server';
  }

  return 'client';
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const createApiConfigurationError = (message: string) => {
  return new ApiError({
    message,
    type: 'configuration',
  });
};

export const normalizeApiError = (error: unknown) => {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof HTTPError) {
    const body = parseErrorBody(error.data);
    const status = error.response.status;
    const message =
      getSafeErrorMessage(getStringField(body, 'message')) ??
      getSafeErrorMessage(getStringField(body, 'error')) ??
      getSafeErrorMessage(body) ??
      getResponseMessage(status) ??
      error.message;

    return new ApiError({
      cause: error,
      code: getStringField(body, 'code'),
      details: body,
      message,
      status,
      type: getErrorType(status),
    });
  }

  if (
    error instanceof NetworkError ||
    error instanceof TimeoutError ||
    error instanceof TypeError
  ) {
    return new ApiError({
      cause: error,
      message: error.message,
      type: 'network',
    });
  }

  return new ApiError({
    cause: error,
    message: 'Unknown API error',
    type: 'unknown',
  });
};
