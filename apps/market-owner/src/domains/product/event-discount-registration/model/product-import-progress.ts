import { z } from '@dongchimi/shared/api';

import type { ProcessingStepProps } from '@/shared/components';

export const productImportStepSchema = z.enum([
  'FILE_UPLOAD',
  'NAME_EXTRACTION',
  'PRICE_EXTRACTION',
  'CATEGORY_CLASSIFICATION',
  'IMAGE_MATCHING',
]);

export const productImportStepStatusSchema = z.enum([
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
]);

export const productImportProgressDataSchema = z.object({
  jobId: z.string(),
  status: z.literal('IN_PROGRESS'),
  progress: z.number().min(0).max(100),
  remainingSeconds: z.number().nonnegative().nullish(),
  currentStep: productImportStepSchema.nullish(),
  steps: z.array(
    z.object({
      step: productImportStepSchema,
      status: productImportStepStatusSchema,
    }),
  ),
});

export const productImportCompletedDataSchema = z.object({
  jobId: z.string(),
  status: z.literal('COMPLETED'),
  progress: z.literal(100),
  totalCount: z.number().int().nonnegative(),
  successCount: z.number().int().nonnegative(),
  failCount: z.number().int().nonnegative(),
});

export const productImportFailedDataSchema = z.object({
  jobId: z.string(),
  status: z.literal('FAILED'),
  code: z.string(),
  message: z.string(),
});

export const productImportCanceledDataSchema = z.object({
  jobId: z.string(),
  status: z.literal('CANCELED'),
  progress: z.number().min(0).max(100).optional(),
});

export type ProductImportProgressDataTypes = z.infer<typeof productImportProgressDataSchema>;
export type ProductImportCompletedDataTypes = z.infer<typeof productImportCompletedDataSchema>;
export type ProductImportFailedDataTypes = z.infer<typeof productImportFailedDataSchema>;
export type ProductImportCanceledDataTypes = z.infer<typeof productImportCanceledDataSchema>;

export type ProductImportProgressEventTypes =
  | { data: ProductImportProgressDataTypes; type: 'progress' }
  | { data: ProductImportCompletedDataTypes; type: 'completed' }
  | { data: ProductImportFailedDataTypes; type: 'failed' }
  | { data: ProductImportCanceledDataTypes; type: 'canceled' };

const productImportStepLabels = {
  FILE_UPLOAD: '파일 업로드',
  NAME_EXTRACTION: '상품명 등록',
  PRICE_EXTRACTION: '판매가격 등록',
  CATEGORY_CLASSIFICATION: '카테고리 분류',
  IMAGE_MATCHING: '상품 이미지 연결',
} satisfies Record<ProductImportProgressDataTypes['steps'][number]['step'], string>;

const productImportStepStatuses = {
  COMPLETED: 'completed',
  FAILED: 'pending',
  IN_PROGRESS: 'processing',
  PENDING: 'pending',
} satisfies Record<
  ProductImportProgressDataTypes['steps'][number]['status'],
  ProcessingStepProps['steps'][number]['status']
>;

export const mapProductImportSteps = (
  steps: ProductImportProgressDataTypes['steps'],
): ProcessingStepProps['steps'] => {
  return steps.map(({ status, step }) => ({
    id: step,
    status: productImportStepStatuses[status],
    statusLabel: status === 'FAILED' ? '실패' : undefined,
    title: productImportStepLabels[step],
  }));
};

export const calculateProductImportProgressPercentage = (
  steps: ProductImportProgressDataTypes['steps'],
) => {
  if (steps.length === 0) {
    return 0;
  }

  const completedStepCount = steps.filter(({ status }) => status === 'COMPLETED').length;

  return Math.round((completedStepCount / steps.length) * 100);
};
