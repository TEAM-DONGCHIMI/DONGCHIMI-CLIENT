import { type RefObject, useCallback, useEffect } from 'react';
import { overlay, useOverlayData } from 'overlay-kit';

interface UseProductOverlayDisclosureParams {
  onDismiss?: () => void;
  overlayId: string;
  triggerRef?: RefObject<HTMLElement | null>;
}

export const useProductOverlayDisclosure = ({
  onDismiss,
  overlayId,
  triggerRef,
}: UseProductOverlayDisclosureParams) => {
  const overlayData = useOverlayData();
  const isOpen = Boolean(overlayData[overlayId]?.isOpen);

  const close = useCallback(() => {
    overlay.close(overlayId);
    overlay.unmount(overlayId);
  }, [overlayId]);

  const open = useCallback(() => {
    overlay.open(() => null, { overlayId });
  }, [overlayId]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }

    open();
  }, [close, isOpen, open]);

  useEffect(() => {
    if (!isOpen || triggerRef == null) {
      return;
    }

    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!triggerRef.current?.contains(target)) {
        onDismiss?.();
        close();
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss?.();
        close();
      }
    };

    document.addEventListener('pointerdown', closeOnPointerDown);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [close, isOpen, onDismiss, triggerRef]);

  useEffect(() => {
    return () => {
      overlay.close(overlayId);
      overlay.unmount(overlayId);
    };
  }, [overlayId]);

  return {
    close,
    isOpen,
    open,
    toggle,
  };
};
