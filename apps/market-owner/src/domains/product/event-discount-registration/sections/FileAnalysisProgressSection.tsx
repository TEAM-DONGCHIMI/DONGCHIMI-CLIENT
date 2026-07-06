import { Button, Flex } from '@dongchimi/design-system/components';

import { ProcessingStep, type ProcessingStepProps } from '@/shared/components';

import * as S from './FileAnalysisProgressSection.css';

export interface FileAnalysisProgressSectionProps {
  onCancel: () => void;
  progressPercentage: number;
  steps: ProcessingStepProps['steps'];
}

const fileAnalysisProgressTitleId = 'file-analysis-progress-title';
const progressLabel = 'AI 분석 진행률';

const clampProgressPercentage = (progressPercentage: number) => {
  return Math.min(Math.max(Math.round(progressPercentage), 0), 100);
};

export const FileAnalysisProgressSection = ({
  onCancel,
  progressPercentage,
  steps,
}: FileAnalysisProgressSectionProps) => {
  const normalizedProgressPercentage = clampProgressPercentage(progressPercentage);
  const isAnalysisComplete = normalizedProgressPercentage >= 100;

  return (
    <Flex
      as='section'
      aria-labelledby={fileAnalysisProgressTitleId}
      className={S.cardClassName}
      direction='column'
    >
      <Flex align='center' as='header' className={S.headerClassName} direction='column'>
        <h1 className={S.titleClassName} id={fileAnalysisProgressTitleId}>
          AI가 상품 정보를 분석하고 있어요
        </h1>
        <p className={S.descriptionClassName}>잠시만 기다려주세요.</p>
      </Flex>

      <ProcessingStep
        aria-label='AI 분석 진행 현황'
        className={S.progressStepListClassName}
        steps={steps}
      />

      <Flex align='center' className={S.progressRowClassName}>
        <div
          aria-label={progressLabel}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={normalizedProgressPercentage}
          className={S.progressTrackClassName}
          role='progressbar'
        >
          <span
            className={S.progressFillClassName}
            style={{ width: `${normalizedProgressPercentage}%` }}
          />
        </div>
        <span className={S.progressValueClassName}>{normalizedProgressPercentage}%</span>
      </Flex>

      <Flex align='center' className={S.actionRowClassName} justify='center'>
        <Button
          className={S.actionButtonClassName}
          color='assistive'
          disabled={isAnalysisComplete}
          onClick={onCancel}
          size='small'
          variant='outlined'
        >
          취소
        </Button>
      </Flex>
    </Flex>
  );
};
