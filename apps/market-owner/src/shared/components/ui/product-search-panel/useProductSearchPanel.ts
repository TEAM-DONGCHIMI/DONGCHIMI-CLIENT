import { type FocusEvent, type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';

import { type SearchBarProps } from '../search-bar';
import { type ProductSearchPanelItemTypes } from './ProductSearchPanel';

const MAX_RESULT_COUNT = 10;
const MIN_SEARCH_QUERY_LENGTH = 1;

const getVisibleResults = (items: ProductSearchPanelItemTypes[]) =>
  items.slice(0, MAX_RESULT_COUNT);

interface UseProductSearchPanelParams {
  items: ProductSearchPanelItemTypes[];
  onQueryChange?: SearchBarProps['onValueChange'];
  onSelectProduct: (item: ProductSearchPanelItemTypes) => void;
}

export const useProductSearchPanel = ({
  items,
  onQueryChange,
  onSelectProduct,
}: UseProductSearchPanelParams) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSearchReady = query.trim().length >= MIN_SEARCH_QUERY_LENGTH;
  const results = useMemo(() => getVisibleResults(items), [items]);
  const shouldRenderPanel = isDropdownOpen && isSearchReady;

  useEffect(() => {
    if (!shouldRenderPanel) {
      return;
    }

    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }

      setIsDropdownOpen(false);
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, [shouldRenderPanel]);

  const handleValueChange: SearchBarProps['onValueChange'] = (nextQuery, event) => {
    setQuery(nextQuery);
    setIsDropdownOpen(nextQuery.trim().length >= MIN_SEARCH_QUERY_LENGTH);
    onQueryChange?.(nextQuery, event);
  };

  const handleSearchFocus = () => {
    if (isSearchReady) {
      setIsDropdownOpen(true);
    }
  };

  const handleResultMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus();
  };

  const handleResultFocus = (event: FocusEvent<HTMLButtonElement>) => {
    event.currentTarget.scrollIntoView?.({ block: 'nearest' });
  };

  const handleResultSelect = (item: ProductSearchPanelItemTypes) => {
    setIsDropdownOpen(false);
    onSelectProduct(item);
  };

  return {
    handleResultFocus,
    handleResultMouseEnter,
    handleResultSelect,
    handleSearchFocus,
    handleValueChange,
    query,
    results,
    rootRef,
    shouldRenderPanel,
  };
};
