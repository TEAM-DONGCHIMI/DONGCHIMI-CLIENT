import { HTTPError, NetworkError, TimeoutError } from 'ky';

export type ApiErrorCategoryTypes =
  | 'auth'
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

const getErrorType = (status: number): ApiErrorCategoryTypes => {
  if (status === 401 || status === 403) {
    return 'auth';
  }

  if (status === 400 || status === 422) {
    return 'validation';
  }

  return 'server';
};

const readErrorBody = async (error: HTTPError) => {
  if (error.data !== undefined) {
    return error.data;
  }

  try {
    return await error.response.clone().json();
  } catch {
    return undefined;
  }
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

export const normalizeApiError = async (error: unknown) => {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof HTTPError) {
    const body = await readErrorBody(error);
    const message =
      getStringField(body, 'message') ?? getStringField(body, 'error') ?? error.message;

    return new ApiError({
      cause: error,
      code: getStringField(body, 'code'),
      details: body,
      message,
      status: error.response.status,
      type: getErrorType(error.response.status),
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
