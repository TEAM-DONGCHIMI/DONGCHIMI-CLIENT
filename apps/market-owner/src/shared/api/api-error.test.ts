import { HTTPError } from 'ky';
import { describe, expect, it } from 'vitest';

import { normalizeApiError } from './api-error';

const createHttpError = ({ body, status }: { body: unknown; status: number }) => {
  const error = new HTTPError(
    new Response(null, { status }),
    new Request('https://api.dongchimi.test/products/import'),
    {} as never,
  );

  error.data = body;

  return error;
};

describe('normalizeApiError', () => {
  it.each([
    {
      label: 'parsed object',
      serverBody: {
        success: false,
        code: 'UNAUTHORIZED',
        message: '인증이 필요합니다.',
        data: null,
      },
    },
    {
      label: 'serialized JSON',
      serverBody: JSON.stringify({
        success: false,
        code: 'UNAUTHORIZED',
        message: '인증이 필요합니다.',
        data: null,
      }),
    },
  ])('preserves the server API error from a $label body', ({ serverBody }) => {
    const error = normalizeApiError(
      createHttpError({
        body: serverBody,
        status: 401,
      }),
    );

    expect(error).toMatchObject({
      code: 'UNAUTHORIZED',
      details: {
        success: false,
        code: 'UNAUTHORIZED',
        message: '인증이 필요합니다.',
        data: null,
      },
      message: '인증이 필요합니다.',
      status: 401,
      type: 'auth',
    });
  });

  it('uses a plain text error body as the message', () => {
    const error = normalizeApiError(
      createHttpError({
        body: '일시적으로 요청을 처리할 수 없습니다.',
        status: 500,
      }),
    );

    expect(error).toMatchObject({
      details: '일시적으로 요청을 처리할 수 없습니다.',
      message: '일시적으로 요청을 처리할 수 없습니다.',
      status: 500,
      type: 'server',
    });
  });

  it.each([
    { body: '', label: 'empty' },
    { body: '   ', label: 'whitespace-only' },
  ])('uses the status fallback for an $label text body', ({ body }) => {
    const error = normalizeApiError(createHttpError({ body, status: 500 }));

    expect(error.message).toBe('서버 에러가 발생했습니다.');
  });

  it('does not expose an HTML proxy error page', () => {
    const error = normalizeApiError(
      createHttpError({
        body: '<html><body>Bad Gateway</body></html>',
        status: 502,
      }),
    );

    expect(error.message).toBe('서버 에러가 발생했습니다.');
  });
});
