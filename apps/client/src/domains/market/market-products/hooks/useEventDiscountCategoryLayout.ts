import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type CategoryRowMeasurementTypes = Readonly<{
  allCategoryWidth: number;
  categoryWidths: readonly number[];
  containerWidth: number;
  gap: number;
  moreCategoryWidth: number;
}>;

type UseEventDiscountCategoryLayoutTypes = Readonly<{
  categories: readonly {
    categoryId: string;
    label: string;
  }[];
  visibleCategoryCount: number;
}>;

export const calculateFirstRowCategoryCount = ({
  allCategoryWidth,
  categoryWidths,
  containerWidth,
  gap,
  moreCategoryWidth,
}: CategoryRowMeasurementTypes) => {
  const fullCategoryRowWidth = categoryWidths.reduce((totalWidth, categoryWidth) => {
    return totalWidth + gap + categoryWidth;
  }, allCategoryWidth);

  if (fullCategoryRowWidth <= containerWidth) {
    return categoryWidths.length;
  }

  let occupiedWidth = allCategoryWidth + gap + moreCategoryWidth;
  let nextCategoryCount = 0;

  for (const categoryWidth of categoryWidths) {
    const nextWidth = occupiedWidth + gap + categoryWidth;

    if (nextWidth > containerWidth) {
      break;
    }

    occupiedWidth = nextWidth;
    nextCategoryCount += 1;
  }

  return nextCategoryCount;
};

const getFlexGapPx = (element: HTMLElement) => {
  const gap = window.getComputedStyle(element).columnGap;
  const parsedGap = Number.parseFloat(gap);

  return Number.isFinite(parsedGap) ? parsedGap : 0;
};

export const useEventDiscountCategoryLayout = ({
  categories,
  visibleCategoryCount,
}: UseEventDiscountCategoryLayoutTypes) => {
  const categoryPrimaryRowRef = useRef<HTMLDivElement>(null);
  const categoryMeasureRowRef = useRef<HTMLDivElement>(null);
  const [firstRowCategoryCount, setFirstRowCategoryCount] = useState(visibleCategoryCount);
  const categoryLayoutSignature = categories
    .map((category) => `${category.categoryId}:${category.label}`)
    .join('|');

  const updateFirstRowCategoryCount = useCallback(() => {
    const categoryPrimaryRowElement = categoryPrimaryRowRef.current;
    const measureRowElement = categoryMeasureRowRef.current;

    if (categoryPrimaryRowElement == null || measureRowElement == null) {
      return;
    }

    const containerWidth = categoryPrimaryRowElement.clientWidth;

    if (containerWidth <= 0) {
      setFirstRowCategoryCount(visibleCategoryCount);
      return;
    }

    const measuredItems = Array.from(measureRowElement.children) as HTMLElement[];
    const allCategoryElement = measuredItems[0];
    const moreCategoryElement = measuredItems[measuredItems.length - 1];

    if (allCategoryElement == null || moreCategoryElement == null) {
      return;
    }

    const gap = getFlexGapPx(measureRowElement);
    const categoryItemElements = measuredItems.slice(1, -1);
    const nextCategoryCount = calculateFirstRowCategoryCount({
      allCategoryWidth: allCategoryElement.getBoundingClientRect().width,
      categoryWidths: categoryItemElements.map((categoryItemElement) => {
        return categoryItemElement.getBoundingClientRect().width;
      }),
      containerWidth,
      gap,
      moreCategoryWidth: moreCategoryElement.getBoundingClientRect().width,
    });

    setFirstRowCategoryCount((currentCount) => {
      return currentCount === nextCategoryCount ? currentCount : nextCategoryCount;
    });
  }, [visibleCategoryCount]);

  useLayoutEffect(() => {
    updateFirstRowCategoryCount();
  }, [categoryLayoutSignature, updateFirstRowCategoryCount]);

  useEffect(() => {
    const categoryPrimaryRowElement = categoryPrimaryRowRef.current;

    if (typeof ResizeObserver === 'undefined' || categoryPrimaryRowElement == null) {
      window.addEventListener('resize', updateFirstRowCategoryCount);

      return () => {
        window.removeEventListener('resize', updateFirstRowCategoryCount);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateFirstRowCategoryCount();
    });

    resizeObserver.observe(categoryPrimaryRowElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateFirstRowCategoryCount]);

  return {
    categoryMeasureRowRef,
    categoryPrimaryRowRef,
    firstRowCategoryCount,
  };
};
