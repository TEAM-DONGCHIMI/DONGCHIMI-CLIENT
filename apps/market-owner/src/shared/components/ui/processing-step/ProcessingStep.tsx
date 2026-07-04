import { cn } from '@dongchimi/design-system/styles';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import * as S from './ProcessingStep.css';

type ProcessingStepStatusTypes = 'completed' | 'processing' | 'pending';

interface ProcessingStepItemTypes {
  id: string;
  status: ProcessingStepStatusTypes;
  statusLabel?: string;
  title: string;
}

export interface ProcessingStepProps extends Omit<ComponentPropsWithoutRef<'ol'>, 'children'> {
  iconSlot?: (step: ProcessingStepItemTypes, index: number) => ReactNode;
  steps: readonly ProcessingStepItemTypes[];
}

const DEFAULT_ARIA_LABEL = '처리 진행 단계';

const statusLabels = {
  completed: '완료',
  processing: '진행 중...',
  pending: '대기',
} satisfies Record<ProcessingStepStatusTypes, string>;

export const ProcessingStep = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  iconSlot,
  steps,
  ...listProps
}: ProcessingStepProps) => {
  const listLabel = ariaLabelledBy ? ariaLabel : (ariaLabel ?? DEFAULT_ARIA_LABEL);

  return (
    <ol
      aria-label={listLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(S.listClassName, className)}
      {...listProps}
    >
      {steps.map((step, index) => {
        const statusLabel = step.statusLabel ?? statusLabels[step.status];
        const icon = iconSlot?.(step, index) ?? (
          <span
            aria-hidden='true'
            className={cn(S.iconClassName, S.iconStatusClassNames[step.status])}
          />
        );

        return (
          <li
            aria-current={step.status === 'processing' ? 'step' : undefined}
            className={cn(S.itemClassName, S.itemStatusClassNames[step.status])}
            key={step.id}
          >
            <span className={S.iconWrapperClassName}>{icon}</span>
            <span className={cn(S.titleClassName, S.titleStatusClassNames[step.status])}>
              {step.title}
            </span>
            <span className={cn(S.statusClassName, S.statusTextClassNames[step.status])}>
              {statusLabel}
            </span>
          </li>
        );
      })}
    </ol>
  );
};
