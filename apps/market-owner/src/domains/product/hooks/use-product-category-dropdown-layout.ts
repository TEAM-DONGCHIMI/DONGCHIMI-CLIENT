import { type CSSProperties, type RefObject, useCallback, useLayoutEffect, useState } from 'react';

const dropdownGapPx = 8;
const dropdownBottomMarginPx = 40;
const dropdownMinHeightPx = 40;

interface UseProductCategoryDropdownLayoutParams {
  containerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  triggerRef: RefObject<HTMLElement | null>;
}

export const useProductCategoryDropdownLayout = ({
  containerRef,
  isOpen,
  triggerRef,
}: UseProductCategoryDropdownLayoutParams) => {
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  const updateDropdownStyle = useCallback(() => {
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    const maxHeight =
      triggerRect == null
        ? dropdownMinHeightPx
        : Math.max(
            dropdownMinHeightPx,
            window.innerHeight - triggerRect.bottom - dropdownGapPx - dropdownBottomMarginPx,
          );

    setDropdownStyle({
      '--product-category-dropdown-max-height': `${maxHeight}px`,
    } as CSSProperties);
  }, [triggerRef]);

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
