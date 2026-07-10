import { type MouseEventHandler } from 'react';

import { Flex } from '@dongchimi/design-system/components';
import {
  IcChevronDownSizeSmallColor70,
  IcSearchSizeSmall,
  IcTuneSizeXsmallColor70,
} from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './DesktopUploadHeader.css';

export type UploadSegmentTypes = 'total' | 'completed' | 'needsEdit';

export interface DesktopUploadHeaderProps {
  className?: string;
  completedCount: number;
  needsEditCount: number;
  searchValue?: string;
  selectedCount?: number;
  selectedSegment: UploadSegmentTypes;
  sortDropdownId?: string;
  sortOpen?: boolean;
  totalCount: number;
  onDeleteSelected?: MouseEventHandler<HTMLButtonElement>;
  onSearch?: SearchBarProps['onSearch'];
  onSearchValueChange?: SearchBarProps['onValueChange'];
  onSegmentChange: (segment: UploadSegmentTypes) => void;
  onSortClick?: MouseEventHandler<HTMLButtonElement>;
}

const segmentLabels: Record<UploadSegmentTypes, string> = {
  total: '총 상품',
  completed: '등록 완료',
  needsEdit: '수정 필요',
};

const searchIcon = <IcSearchSizeSmall />;
const sortLeadingIcon = <IcTuneSizeXsmallColor70 />;
const sortTrailingIcon = <IcChevronDownSizeSmallColor70 />;

const getSegmentAriaCurrent = (active: boolean) => {
  if (!active) {
    return undefined;
  }

  return 'page';
};

const SegmentNavigation = ({
  completedCount,
  needsEditCount,
  selectedSegment,
  totalCount,
  onSegmentChange,
}: {
  completedCount: number;
  needsEditCount: number;
  selectedSegment: UploadSegmentTypes;
  totalCount: number;
  onSegmentChange: (segment: UploadSegmentTypes) => void;
}) => {
  const items = [
    { count: totalCount, label: segmentLabels.total, value: 'total' },
    { count: completedCount, label: segmentLabels.completed, value: 'completed' },
    { count: needsEditCount, label: segmentLabels.needsEdit, value: 'needsEdit' },
  ] as const;

  return (
    <Flex as='nav' className={S.segmentNavigationClassName} aria-label='상품 상태 필터'>
      {items.map((item) => {
        const isActive = item.value === selectedSegment;

        return (
          <button
            key={item.value}
            aria-current={getSegmentAriaCurrent(isActive)}
            aria-label={`${item.label} ${item.count}`}
            className={S.segmentItemRecipe({ active: isActive })}
            onClick={() => onSegmentChange(item.value)}
            type='button'
          >
            <span className={S.segmentLabelRecipe({ active: isActive })}>{item.label}</span>
            <span className={S.segmentCountRecipe({ active: isActive })}>{item.count}</span>
          </button>
        );
      })}
    </Flex>
  );
};

const SelectedProductAction = ({
  selectedCount = 0,
  onDeleteSelected,
}: {
  selectedCount: number;
  onDeleteSelected?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const hasSelection = selectedCount > 0;

  return (
    <Flex align='center' className={S.selectedActionClassName}>
      <span className={S.selectedCountClassName}>선택된 상품 ({selectedCount})</span>
      <button
        className={S.deleteButtonRecipe({ active: hasSelection })}
        disabled={!hasSelection}
        onClick={onDeleteSelected}
        type='button'
      >
        선택삭제
      </button>
    </Flex>
  );
};

const SortButton = ({
  controlsId,
  open = false,
  onSortClick,
}: {
  controlsId?: string;
  open?: boolean;
  onSortClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const popupProps: {
    'aria-controls'?: string;
    'aria-expanded'?: boolean;
    'aria-haspopup'?: true;
  } = {};

  if (controlsId != null) {
    popupProps['aria-controls'] = controlsId;
    popupProps['aria-expanded'] = open;
    popupProps['aria-haspopup'] = true;
  }

  return (
    <button
      className={S.sortButtonRecipe({ open })}
      onClick={onSortClick}
      type='button'
      {...popupProps}
    >
      <span aria-hidden='true' className={S.iconClassName}>
        {sortLeadingIcon}
      </span>
      <span className={S.sortButtonTextClassName}>정렬</span>
      <span aria-hidden='true' className={S.iconClassName}>
        {sortTrailingIcon}
      </span>
    </button>
  );
};

export const DesktopUploadHeader = ({
  className,
  completedCount,
  needsEditCount,
  searchValue,
  selectedCount,
  selectedSegment,
  sortDropdownId,
  sortOpen,
  totalCount,
  onDeleteSelected,
  onSearch,
  onSearchValueChange,
  onSegmentChange,
  onSortClick,
}: DesktopUploadHeaderProps) => {
  const showSelectedProductAction = selectedCount != null || onDeleteSelected != null;
  const showSortButton = sortDropdownId != null || onSortClick != null;
  const showSearchBar = searchValue != null || onSearch != null || onSearchValueChange != null;
  const showActions = showSelectedProductAction || showSortButton || showSearchBar;

  return (
    <Flex align='center' as='header' className={cn(S.headerClassName, className)} justify='between'>
      <SegmentNavigation
        completedCount={completedCount}
        needsEditCount={needsEditCount}
        onSegmentChange={onSegmentChange}
        selectedSegment={selectedSegment}
        totalCount={totalCount}
      />

      {showActions && (
        <Flex align='center' className={S.actionsClassName}>
          {showSelectedProductAction && (
            <SelectedProductAction
              selectedCount={selectedCount ?? 0}
              onDeleteSelected={onDeleteSelected}
            />
          )}
          {showSortButton && (
            <SortButton controlsId={sortDropdownId} open={sortOpen} onSortClick={onSortClick} />
          )}
          {showSearchBar && (
            <SearchBar
              aria-label='상품 검색'
              icon={searchIcon}
              onSearch={onSearch}
              onValueChange={onSearchValueChange}
              placeholder='상품 검색...'
              value={searchValue}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
