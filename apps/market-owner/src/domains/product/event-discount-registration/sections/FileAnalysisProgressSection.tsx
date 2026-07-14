import { cn } from '@dongchimi/design-system/styles';
import { Button, Flex } from '@dongchimi/design-system/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { ProcessingStep, type ProcessingStepProps } from '@/shared/components';

import * as S from './FileAnalysisProgressSection.css';

export interface FileAnalysisProgressSectionProps {
  isCancelPending?: boolean;
  onCancel: () => void;
  progressPercentage: number;
  steps: ProcessingStepProps['steps'];
}

const fileAnalysisProgressTitleId = 'file-analysis-progress-title';
const progressLabel = 'AI 분석 진행률';
const MIN_PROGRESS_PERCENTAGE = 0;
const MAX_PROGRESS_PERCENTAGE = 100;
const spinnerLottieSrc = '/lottie/spinner.lottie';

const renderFileAnalysisStepIcon: NonNullable<ProcessingStepProps['iconSlot']> = (step) => {
  if (step.status !== 'processing') {
    return undefined;
  }

  return (
    <DotLottieReact
      aria-hidden='true'
      autoplay
      className={S.processingIconClassName}
      loop
      src={spinnerLottieSrc}
    />
  );
};

const clampProgressPercentage = (progressPercentage: number) => {
  return Math.min(
    Math.max(Math.round(progressPercentage), MIN_PROGRESS_PERCENTAGE),
    MAX_PROGRESS_PERCENTAGE,
  );
};

const hasStartedAnalysis = ({
  progressPercentage,
  steps,
}: Pick<FileAnalysisProgressSectionProps, 'progressPercentage' | 'steps'>) => {
  return (
    progressPercentage > MIN_PROGRESS_PERCENTAGE || steps.some((step) => step.status !== 'pending')
  );
};

const hasCompletedAnalysis = ({
  progressPercentage,
  steps,
}: Pick<FileAnalysisProgressSectionProps, 'progressPercentage' | 'steps'>) => {
  return (
    progressPercentage >= MAX_PROGRESS_PERCENTAGE ||
    (steps.length > 0 && steps.every((step) => step.status === 'completed'))
  );
};

const getCardShadowVariant = ({
  progressPercentage,
  steps,
}: Pick<FileAnalysisProgressSectionProps, 'progressPercentage' | 'steps'>) => {
  if (hasStartedAnalysis({ progressPercentage, steps })) {
    return 'active';
  }

  return 'pending';
};

export const FileAnalysisProgressSection = ({
  isCancelPending = false,
  onCancel,
  progressPercentage,
  steps,
}: FileAnalysisProgressSectionProps) => {
  const normalizedProgressPercentage = clampProgressPercentage(progressPercentage);
  const isAnalysisComplete = hasCompletedAnalysis({ progressPercentage, steps });
  const cardShadowVariant = getCardShadowVariant({ progressPercentage, steps });

  return (
    <Flex
      as='section'
      aria-labelledby={fileAnalysisProgressTitleId}
      className={cn(S.cardClassName, S.cardShadowClassNames[cardShadowVariant])}
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
        iconSlot={renderFileAnalysisStepIcon}
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
          disabled={isAnalysisComplete || isCancelPending}
          onClick={onCancel}
          size='small'
          variant='outlined'
        >
          {isCancelPending ? '취소 중' : '취소'}
        </Button>
      </Flex>
    </Flex>
  );
};
