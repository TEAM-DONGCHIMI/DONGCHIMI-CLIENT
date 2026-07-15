import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'textarea:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface UsePosGuideModalBehaviorParams {
  open: boolean;
  onClose: () => void;
}

const getFocusableElements = (element: HTMLElement) => {
  return Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (candidate) => {
      return (
        !candidate.hasAttribute('disabled') && candidate.getAttribute('aria-hidden') !== 'true'
      );
    },
  );
};

export const usePosGuideModalBehavior = ({ open, onClose }: UsePosGuideModalBehaviorParams) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const dialogElement = dialogRef.current;
    const overlayElement = overlayRef.current;
    const previouslyFocusedElement = document.activeElement;
    const originalBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    initialFocusRef.current?.focus();

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      onCloseRef.current();
    };

    const handleOverlayMouseDown = (event: MouseEvent) => {
      if (event.target === overlayElement) {
        onCloseRef.current();
      }
    };

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || dialogElement == null) {
        return;
      }

      const focusableElements = getFocusableElements(dialogElement);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogElement.focus();
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
    dialogElement?.addEventListener('keydown', handleDialogKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      overlayElement?.removeEventListener('mousedown', handleOverlayMouseDown);
      dialogElement?.removeEventListener('keydown', handleDialogKeyDown);
      document.body.style.overflow = originalBodyOverflow;

      const canRestorePreviousFocus =
        previouslyFocusedElement instanceof HTMLElement && previouslyFocusedElement.isConnected;

      if (canRestorePreviousFocus) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open]);

  return {
    dialogRef,
    initialFocusRef,
    overlayRef,
  };
};
