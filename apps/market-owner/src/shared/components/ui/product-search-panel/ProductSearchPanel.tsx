import {
  type ComponentPropsWithoutRef,
  type ChangeEvent,
  type FocusEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Chip, Toast } from '@dongchimi/design-system';
import { IcSearchSizeSmall } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './ProductSearchPanel.css';

type NativeDivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export interface ProductSearchPanelItemTypes {
  id: string;
  label: string;
  name: string;
  registeredAt: string | number | Date;
}

type ProductSearchPanelStatusTypes = 'default' | 'error';

export interface ProductSearchPanelProps extends NativeDivProps {
  emptyMessage?: string;
  errorMessage?: string;
  items: ProductSearchPanelItemTypes[];
  onQueryChange?: (query: string, event: ChangeEvent<HTMLInputElement>) => void;
  onSelectProduct: (item: ProductSearchPanelItemTypes) => void;
  placeholder?: string;
  status?: ProductSearchPanelStatusTypes;
}

const DEFAULT_EMPTY_MESSAGE = '검색 결과가 없어요. 상품을 등록해보세요.';
const DEFAULT_ERROR_MESSAGE = '상품 정보를 불러오지 못했어요.';
const DEFAULT_PLACEHOLDER = '상품 검색...';
const DEFAULT_VISIBLE_RESULT_COUNT = 4;
const MAX_RESULT_COUNT = 10;
const MIN_SEARCH_QUERY_LENGTH = 1;

const searchIcon = <IcSearchSizeSmall aria-hidden='true' className={S.searchIconClassName} />;

const normalizeSearchText = (value: string) => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');

const getRegisteredTime = (registeredAt: ProductSearchPanelItemTypes['registeredAt']) => {
  if (registeredAt instanceof Date) {
    return registeredAt.getTime();
  }

  if (typeof registeredAt === 'number') {
    return registeredAt;
  }

  const parsedTime = Date.parse(registeredAt);

  return Number.isNaN(parsedTime) ? 0 : parsedTime;
};

const getMatchScore = (item: ProductSearchPanelItemTypes, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedName = normalizeSearchText(item.name);
  const normalizedLabel = normalizeSearchText(item.label);

  if (normalizedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
    return 0;
  }

  if (normalizedName === normalizedQuery) {
    return 400;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 300;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 200;
  }

  if (normalizedLabel.includes(normalizedQuery)) {
    return 100;
  }

  return 0;
};

const getSearchResults = (items: ProductSearchPanelItemTypes[], query: string) => {
  return items
    .map((item) => ({
      item,
      matchScore: getMatchScore(item, query),
    }))
    .filter(({ matchScore }) => matchScore > 0)
    .sort((left, right) => {
      if (left.matchScore !== right.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return getRegisteredTime(right.item.registeredAt) - getRegisteredTime(left.item.registeredAt);
    })
    .slice(0, MAX_RESULT_COUNT)
    .map(({ item }) => item);
};

export const ProductSearchPanel = ({
  className,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  items,
  onQueryChange,
  onSelectProduct,
  placeholder = DEFAULT_PLACEHOLDER,
  status = 'default',
  ...props
}: ProductSearchPanelProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSearchReady = query.trim().length >= MIN_SEARCH_QUERY_LENGTH;
  const isError = status === 'error';
  const results = useMemo(() => getSearchResults(items, query), [items, query]);
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

  return (
    <div ref={rootRef} className={cn(S.rootClassName, className)} {...props}>
      <SearchBar
        aria-label='상품 검색'
        icon={searchIcon}
        isError={isError}
        onFocus={handleSearchFocus}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        value={query}
      />

      {shouldRenderPanel && (
        <div className={S.dropdownClassName}>
          {isError ? (
            <Toast className={S.errorToastClassName} status='error'>
              {errorMessage}
            </Toast>
          ) : results.length > 0 ? (
            <ul
              aria-label='상품 검색 결과'
              className={S.resultListClassName}
              data-scrollable={results.length > DEFAULT_VISIBLE_RESULT_COUNT || undefined}
            >
              {results.map((item) => (
                <li className={S.resultItemClassName} key={item.id}>
                  <button
                    className={S.resultButtonClassName}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSelectProduct(item);
                    }}
                    onFocus={handleResultFocus}
                    onMouseEnter={handleResultMouseEnter}
                    type='button'
                  >
                    <Chip
                      className={S.resultLabelChipClassName}
                      color='primary'
                      size='desktop'
                      variant='soft'
                    >
                      {item.label}
                    </Chip>
                    <span className={S.resultNameClassName}>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={S.emptyStateClassName} role='status'>
              <Chip
                className={S.emptyMessageChipClassName}
                color='primary'
                size='desktop'
                variant='soft'
              >
                {emptyMessage}
              </Chip>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
