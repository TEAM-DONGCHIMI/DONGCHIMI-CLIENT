import { useCallback, useMemo, useState } from 'react';

interface UseRegistrationResultPaginationParams<TItem> {
  items: readonly TItem[];
  pageSize: number;
  rangeTotalCount: number;
}

const getPaginationPages = (totalItemCount: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(totalItemCount / pageSize));

  return Array.from({ length: pageCount }, (_, index) => index + 1);
};

export const useRegistrationResultPagination = <TItem>({
  items,
  pageSize,
  rangeTotalCount,
}: UseRegistrationResultPaginationParams<TItem>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = useMemo(() => getPaginationPages(items.length, pageSize), [items.length, pageSize]);
  const lastPage = pages[pages.length - 1] ?? 1;
  const visiblePage = Math.min(currentPage, lastPage);
  const pageStartIndex = (visiblePage - 1) * pageSize;
  const pageEndIndex = pageStartIndex + pageSize;
  const pageItems = useMemo(
    () => items.slice(pageStartIndex, pageEndIndex),
    [items, pageEndIndex, pageStartIndex],
  );
  const rangeStart = rangeTotalCount > 0 ? pageStartIndex + 1 : 0;
  const rangeEnd = Math.min(pageEndIndex, rangeTotalCount);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (nextPage: number) => {
      if (nextPage < 1 || nextPage > lastPage) {
        return false;
      }

      setCurrentPage(nextPage);

      return true;
    },
    [lastPage],
  );

  return {
    currentPage: visiblePage,
    goToPage,
    lastPage,
    pageItems,
    pages,
    rangeEnd,
    rangeStart,
    resetPage,
  };
};
