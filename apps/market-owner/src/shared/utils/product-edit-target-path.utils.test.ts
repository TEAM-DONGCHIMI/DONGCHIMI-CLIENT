import { describe, expect, it } from 'vitest';

import { createProductEditTargetPath } from './product-edit-target-path.utils';

describe('createProductEditTargetPath', () => {
  it('creates a today-special edit path with the target productId', () => {
    expect(
      createProductEditTargetPath({
        dealType: 'DAILY',
        productId: 101,
      }),
    ).toBe('/products/today-special/edit?productId=101');
  });

  it('creates an event-discount edit path with the target productId', () => {
    expect(
      createProductEditTargetPath({
        dealType: 'PERIODIC',
        productId: 201,
      }),
    ).toBe('/products/event-discount/edit?productId=201');
  });
});
