import { describe, expect, it } from 'vitest';

import {
  calculateProductImportProgressPercentage,
  mapProductImportSteps,
} from './product-import-progress';

describe('mapProductImportSteps', () => {
  it('maps API step names and statuses to processing step UI values', () => {
    expect(
      mapProductImportSteps([
        { step: 'FILE_UPLOAD', status: 'COMPLETED' },
        { step: 'NAME_EXTRACTION', status: 'IN_PROGRESS' },
        { step: 'PRICE_EXTRACTION', status: 'PENDING' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'FAILED' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ]),
    ).toEqual([
      { id: 'FILE_UPLOAD', status: 'completed', statusLabel: undefined, title: '파일 업로드' },
      {
        id: 'NAME_EXTRACTION',
        status: 'processing',
        statusLabel: undefined,
        title: '상품명 등록',
      },
      {
        id: 'PRICE_EXTRACTION',
        status: 'pending',
        statusLabel: undefined,
        title: '판매가격 등록',
      },
      {
        id: 'CATEGORY_CLASSIFICATION',
        status: 'pending',
        statusLabel: '실패',
        title: '카테고리 분류',
      },
      {
        id: 'IMAGE_MATCHING',
        status: 'pending',
        statusLabel: undefined,
        title: '상품 이미지 연결',
      },
    ]);
  });
});

describe('calculateProductImportProgressPercentage', () => {
  it('calculates progress in 20 percent increments from completed analysis steps', () => {
    expect(
      calculateProductImportProgressPercentage([
        { step: 'FILE_UPLOAD', status: 'COMPLETED' },
        { step: 'NAME_EXTRACTION', status: 'COMPLETED' },
        { step: 'PRICE_EXTRACTION', status: 'COMPLETED' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'COMPLETED' },
        { step: 'IMAGE_MATCHING', status: 'IN_PROGRESS' },
      ]),
    ).toBe(80);
  });

  it('does not count pending, processing, or failed steps as progress increments', () => {
    expect(
      calculateProductImportProgressPercentage([
        { step: 'FILE_UPLOAD', status: 'COMPLETED' },
        { step: 'NAME_EXTRACTION', status: 'IN_PROGRESS' },
        { step: 'PRICE_EXTRACTION', status: 'PENDING' },
        { step: 'CATEGORY_CLASSIFICATION', status: 'FAILED' },
        { step: 'IMAGE_MATCHING', status: 'PENDING' },
      ]),
    ).toBe(20);
  });
});
