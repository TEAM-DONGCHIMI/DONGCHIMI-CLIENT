import { useEffect, useRef } from 'react';

import { IcClose } from '@dongchimi/design-system/icons';

import type { registrationMethodFixture } from '../fixtures';
import * as S from './PosExcelGuidePanel.css';

type PosGuideFixtureTypes = typeof registrationMethodFixture.posGuide;

export interface PosExcelGuidePanelProps {
  open: boolean;
  posGuide: PosGuideFixtureTypes;
  onClose: () => void;
}

const PANEL_LABEL = 'POS 엑셀 다운로드 안내';
const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])';

export const PosExcelGuidePanel = ({ open, posGuide, onClose }: PosExcelGuidePanelProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const overlayElement = overlayRef.current;
    const panelElement = panelRef.current;
    const previouslyFocusedElement = document.activeElement;
    const originalBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
    };

    const handleOverlayMouseDown = (event: MouseEvent) => {
      if (event.target === overlayElement) {
        onCloseRef.current();
      }
    };

    const handlePanelKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || panelElement == null) {
        return;
      }

      const focusableElements = Array.from(
        panelElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    overlayElement?.addEventListener('mousedown', handleOverlayMouseDown);
    panelElement?.addEventListener('keydown', handlePanelKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      overlayElement?.removeEventListener('mousedown', handleOverlayMouseDown);
      panelElement?.removeEventListener('keydown', handlePanelKeyDown);
      document.body.style.overflow = originalBodyOverflow;

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className={S.overlayClassName} ref={overlayRef}>
      <div
        aria-label={PANEL_LABEL}
        aria-modal='true'
        className={S.panelClassName}
        ref={panelRef}
        role='dialog'
      >
        <button
          aria-label='POS 안내 닫기'
          className={S.closeButtonClassName}
          onClick={onClose}
          ref={closeButtonRef}
          type='button'
        >
          <IcClose aria-hidden='true' />
        </button>

        <div className={S.contentClassName}>
          <h2 className={S.titleClassName}>{posGuide.title}</h2>

          <ol className={S.stepListClassName}>
            {posGuide.steps.map((step, index) => (
              <li className={S.stepItemClassName} key={step.title}>
                <span className={S.stepNumberClassName}>{index + 1}</span>
                <div className={S.stepBodyClassName}>
                  <h3 className={S.stepTitleClassName}>{step.title}</h3>
                  <p className={S.stepDescriptionClassName}>{step.description}</p>
                  <span aria-hidden='true' className={S.stepImagePlaceholderClassName} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
