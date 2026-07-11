import { useEffect, useRef } from 'react';

export const useProductEditModalTitleFocus = (open: boolean) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let innerFrameId = 0;
    const frameId = window.requestAnimationFrame(() => {
      innerFrameId = window.requestAnimationFrame(() => {
        titleRef.current?.focus();
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(innerFrameId);
    };
  }, [open]);

  return titleRef;
};
