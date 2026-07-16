import { type CSSProperties, type RefObject, useCallback, useLayoutEffect, useState } from 'react';

const dropdownGapPx = 8;
const dropdownBottomMarginPx = 40;
const dropdownFallbackMaxHeightPx = 40;

interface UseProductCategoryDropdownLayoutParams {
  containerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  positionStrategy?: 'absolute' | 'fixed';
  triggerRef: RefObject<HTMLElement | null>;
}

export const useProductCategoryDropdownLayout = ({
  containerRef,
  isOpen,
  positionStrategy = 'absolute',
  triggerRef,
}: UseProductCategoryDropdownLayoutParams) => {
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  const updateDropdownStyle = useCallback(() => {
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    const maxHeight =
      triggerRect == null
        ? dropdownFallbackMaxHeightPx
        : Math.max(
            0,
            window.innerHeight - triggerRect.bottom - dropdownGapPx - dropdownBottomMarginPx,
          );
    const positionStyle: CSSProperties =
      triggerRect != null && positionStrategy === 'fixed'
        ? {
            bottom: 'auto',
            left: `${triggerRect.left}px`,
            margin: 0,
            position: 'fixed',
            right: 'auto',
            top: `${triggerRect.bottom + dropdownGapPx}px`,
            width: `${triggerRect.width}px`,
          }
        : {};

    const maxHeightStyle = {
      '--product-category-dropdown-max-height': `${maxHeight}px`,
    } as CSSProperties;

    setDropdownStyle({ ...positionStyle, ...maxHeightStyle });
  }, [positionStrategy, triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const updateDropdownOnOutsideScroll = (event: Event) => {
      const target = event.target;

      if (target instanceof Node && containerRef.current?.contains(target)) {
        return;
      }

      updateDropdownStyle();
    };

    updateDropdownStyle();
    window.addEventListener('resize', updateDropdownStyle);
    document.addEventListener('scroll', updateDropdownOnOutsideScroll, true);

    return () => {
      window.removeEventListener('resize', updateDropdownStyle);
      document.removeEventListener('scroll', updateDropdownOnOutsideScroll, true);
    };
  }, [containerRef, isOpen, updateDropdownStyle]);

  return dropdownStyle;
};
