import type { ProcessingStepProps } from '@/shared/components';

const fileAnalysisProgressStepLabels = [
  '파일 업로드',
  '상품명 등록',
  '판매가격 등록',
  '상품 이미지 연결',
  '카테고리 분류',
] as const;

const createProgressSteps = (
  statuses: readonly ProcessingStepProps['steps'][number]['status'][],
) => {
  return fileAnalysisProgressStepLabels.map((title, index) => ({
    id: title,
    status: statuses[index] ?? 'pending',
    title,
  })) satisfies ProcessingStepProps['steps'];
};

export const fileAnalysisProgressFixtures = {
  completed: {
    progressPercentage: 100,
    steps: createProgressSteps(['completed', 'completed', 'completed', 'completed', 'completed']),
  },
  pending: {
    progressPercentage: 0,
    steps: createProgressSteps(['pending', 'pending', 'pending', 'pending', 'pending']),
  },
  processing: {
    progressPercentage: 24,
    steps: createProgressSteps(['completed', 'processing', 'pending', 'pending', 'pending']),
  },
} as const;
