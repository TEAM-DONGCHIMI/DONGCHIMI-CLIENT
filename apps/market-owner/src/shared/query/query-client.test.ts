import { describe, expect, it } from 'vitest';

import { queryClientDefaultOptions } from './query-client';

describe('queryClientDefaultOptions', () => {
  it('routes query errors to boundaries without throwing mutation errors', () => {
    expect(queryClientDefaultOptions.queries.throwOnError).toBe(true);
    expect(queryClientDefaultOptions.mutations.throwOnError).toBe(false);
  });
});
