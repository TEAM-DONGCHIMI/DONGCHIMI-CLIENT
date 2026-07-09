import { IcClose } from '@dongchimi/design-system/icons';

import type { registrationMethodFixture } from '../fixtures';
import * as S from './PosExcelGuidePanel.css';
import { useModalDialogBehavior } from './useModalDialogBehavior';

type PosGuideFixtureTypes = typeof registrationMethodFixture.posGuide;

export interface PosExcelGuidePanelProps {
  open: boolean;
  posGuide: PosGuideFixtureTypes;
  onClose: () => void;
}

const PANEL_LABEL = 'POS 엑셀 다운로드 안내';
const GUIDE_IMAGE_SIZE_KEYS = ['large', 'medium', 'small'] as const;

export const PosExcelGuidePanel = ({ open, posGuide, onClose }: PosExcelGuidePanelProps) => {
  const { dialogRef, initialFocusRef, overlayRef } = useModalDialogBehavior({ open, onClose });

  if (!open) {
    return null;
  }

  return (
    <div className={S.overlayClassName} ref={overlayRef}>
      <div
        aria-label={PANEL_LABEL}
        aria-modal='true'
        className={S.panelClassName}
        ref={dialogRef}
        role='dialog'
        tabIndex={-1}
      >
        <button
          aria-label='POS 안내 닫기'
          className={S.closeButtonClassName}
          onClick={onClose}
          ref={initialFocusRef}
          type='button'
        >
          <IcClose aria-hidden='true' />
        </button>

        <div className={S.contentClassName}>
          <h2 className={S.titleClassName}>{posGuide.title}</h2>

          <div className={S.imageListClassName}>
            {posGuide.steps.map((step, index) => {
              const imageSizeKey = GUIDE_IMAGE_SIZE_KEYS[index] ?? 'small';

              return (
                <span
                  aria-label={`${step.title}: ${step.description}`}
                  className={[
                    S.guideImagePlaceholderClassName,
                    S.guideImagePlaceholderHeightClassNames[imageSizeKey],
                  ].join(' ')}
                  key={step.title}
                  role='img'
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
