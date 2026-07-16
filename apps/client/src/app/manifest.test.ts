import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('PWA manifest', () => {
  it('defines install metadata and required icon sizes', () => {
    const result = manifest();

    expect(result).toMatchObject({
      background_color: '#FFFFFF',
      display: 'standalone',
      id: '/',
      name: '동치미',
      orientation: 'portrait',
      scope: '/',
      short_name: '동치미',
      start_url: '/',
      theme_color: '#FFFFFF',
    });
    expect(result.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ purpose: 'any', sizes: '192x192' }),
        expect.objectContaining({ purpose: 'any', sizes: '512x512' }),
        expect.objectContaining({ purpose: 'maskable', sizes: '512x512' }),
      ]),
    );
  });
});
