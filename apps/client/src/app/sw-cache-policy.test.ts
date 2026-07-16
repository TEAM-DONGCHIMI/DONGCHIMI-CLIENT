import { describe, expect, it } from 'vitest';

import { isPublicCacheableResponse } from './sw-cache-policy';

describe('isPublicCacheableResponse', () => {
  it('allows successful public responses', () => {
    const response = new Response(null, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

    expect(isPublicCacheableResponse(response)).toBe(true);
  });

  it.each(['private, max-age=60', 'no-store'])('rejects %s responses', (cacheControl) => {
    const response = new Response(null, {
      status: 200,
      headers: {
        'Cache-Control': cacheControl,
      },
    });

    expect(isPublicCacheableResponse(response)).toBe(false);
  });

  it('rejects unsuccessful responses', () => {
    const response = new Response(null, { status: 404 });

    expect(isPublicCacheableResponse(response)).toBe(false);
  });
});
