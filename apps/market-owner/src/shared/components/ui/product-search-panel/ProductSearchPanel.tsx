import { type ComponentPropsWithoutRef, type FocusEvent, type MouseEvent } from 'react';

import { Chip, Toast } from '@dongchimi/design-system';
import { IcSearchSizeSmall } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './ProductSearchPanel.css';
import { useProductSearchPanel } from './useProductSearchPanel';

type NativeDivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export interface ProductSearchPanelItemTypes {
  id: string;
  label: string;
  name: string;
}

type ProductSearchPanelStatusTypes = 'default' | 'error';

export interface ProductSearchPanelProps extends NativeDivProps {
  emptyMessage?: string;
  errorMessage?: string;
  items: ProductSearchPanelItemTypes[];
  onQueryChange?: SearchBarProps['onValueChange'];
  onSelectProduct: (item: ProductSearchPanelItemTypes) => void;
  placeholder?: string;
  status?: ProductSearchPanelStatusTypes;
}

const DEFAULT_EMPTY_MESSAGE = '검색 결과가 없어요. 상품을 등록해보세요.';
const DEFAULT_ERROR_MESSAGE = '상품 정보를 불러오지 못했어요.';
const DEFAULT_PLACEHOLDER = '상품 검색...';
const DEFAULT_VISIBLE_RESULT_COUNT = 4;

const searchIcon = <IcSearchSizeSmall aria-hidden='true' className={S.searchIconClassName} />;

interface ProductSearchResultListProps {
  onResultFocus: (event: FocusEvent<HTMLButtonElement>) => void;
  onResultMouseEnter: (event: MouseEvent<HTMLButtonElement>) => void;
  onResultSelect: (item: ProductSearchPanelItemTypes) => void;
  results: ProductSearchPanelItemTypes[];
}

const ProductSearchResultList = ({
  onResultFocus,
  onResultMouseEnter,
  onResultSelect,
  results,
}: ProductSearchResultListProps) => {
  return (
    <ul
      aria-label='상품 검색 결과'
      className={S.resultListClassName}
      data-scrollable={results.length > DEFAULT_VISIBLE_RESULT_COUNT || undefined}
    >
      {results.map((item) => (
        <li className={S.resultItemClassName} key={item.id}>
          <button
            className={S.resultButtonClassName}
            onClick={() => onResultSelect(item)}
            onFocus={onResultFocus}
            onMouseEnter={onResultMouseEnter}
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
  );
};

interface ProductSearchDropdownContentProps extends ProductSearchResultListProps {
  emptyMessage: string;
  errorMessage: string;
  isError: boolean;
}

const ProductSearchDropdownContent = ({
  emptyMessage,
  errorMessage,
  isError,
  onResultFocus,
  onResultMouseEnter,
  onResultSelect,
  results,
}: ProductSearchDropdownContentProps) => {
  if (isError) {
    return (
      <Toast className={S.errorToastClassName} status='error'>
        {errorMessage}
      </Toast>
    );
  }

  if (results.length === 0) {
    return (
      <div className={S.emptyStateClassName} role='status'>
        <Chip className={S.emptyMessageChipClassName} color='primary' size='desktop' variant='soft'>
          {emptyMessage}
        </Chip>
      </div>
    );
  }

  return (
    <ProductSearchResultList
      onResultFocus={onResultFocus}
      onResultMouseEnter={onResultMouseEnter}
      onResultSelect={onResultSelect}
      results={results}
    />
  );
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
  const {
    handleResultFocus,
    handleResultMouseEnter,
    handleResultSelect,
    handleSearchFocus,
    handleValueChange,
    query,
    results,
    rootRef,
    shouldRenderPanel,
  } = useProductSearchPanel({
    items,
    onQueryChange,
    onSelectProduct,
  });

  return (
    <div ref={rootRef} className={cn(S.rootClassName, className)} {...props}>
      <SearchBar
        aria-label='상품 검색'
        icon={searchIcon}
        isError={status === 'error'}
        onFocus={handleSearchFocus}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        value={query}
      />

      {shouldRenderPanel && (
        <div className={S.dropdownClassName}>
          <ProductSearchDropdownContent
            emptyMessage={emptyMessage}
            errorMessage={errorMessage}
            isError={status === 'error'}
            onResultFocus={handleResultFocus}
            onResultMouseEnter={handleResultMouseEnter}
            onResultSelect={handleResultSelect}
            results={results}
          />
        </div>
      )}
    </div>
  );
};
