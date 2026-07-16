import { describe, expect, it } from 'vitest';

import {
  createProductImportRouteState,
  getProductImportFileConfirmation,
} from './product-import-route-state';

describe('product import route state', () => {
  it('round-trips a valid uploaded file confirmation', () => {
    const fileConfirmation = {
      fileName: '상품목록.xlsx',
      fileUrl: 'https://static.dongchimi.kr/products/imports/list.xlsx',
    };

    expect(
      getProductImportFileConfirmation(createProductImportRouteState(fileConfirmation)),
    ).toEqual(fileConfirmation);
  });

  it.each([
    undefined,
    null,
    {},
    { productImportFileConfirmation: null },
    { productImportFileConfirmation: { fileName: '', fileUrl: 'https://example.com/file.xlsx' } },
    { productImportFileConfirmation: { fileName: 'file.xlsx', fileUrl: '' } },
  ])('rejects invalid route state %#', (routeState) => {
    expect(getProductImportFileConfirmation(routeState)).toBeUndefined();
  });
});
