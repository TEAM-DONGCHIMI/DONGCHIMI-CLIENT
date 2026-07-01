import { type MouseEventHandler, useState } from 'react';

import { Flex } from '@dongchimi/design-system/components';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './DesktopUploadHeader.css';

export type UploadSegmentTypes = 'total' | 'completed' | 'needsEdit';

export interface DesktopUploadHeaderProps {
  activeSegment?: UploadSegmentTypes;
  className?: string;
  completedCount: number;
  defaultSearchValue?: string;
  needsEditCount: number;
  searchValue?: string;
  selectedCount?: number;
  totalCount: number;
  onDeleteSelected?: MouseEventHandler<HTMLButtonElement>;
  onSearch?: SearchBarProps['onSearch'];
  onSearchValueChange?: SearchBarProps['onValueChange'];
  onSegmentChange?: (segment: UploadSegmentTypes) => void;
  onSortClick?: MouseEventHandler<HTMLButtonElement>;
}

interface SegmentItem {
  count: number;
  label: string;
  value: UploadSegmentTypes;
}

const segmentLabels: Record<UploadSegmentTypes, string> = {
  total: '총 상품',
  completed: '등록 완료',
  needsEdit: '수정 필요',
};

const searchIcon = <span aria-hidden='true' className={S.iconClassName} />;
const sortIcon = <span aria-hidden='true' className={S.iconClassName} />;

const SegmentNavigation = ({
  activeSegment,
  items,
  onSegmentChange,
}: {
  activeSegment: UploadSegmentTypes;
  items: SegmentItem[];
  onSegmentChange?: (segment: UploadSegmentTypes) => void;
}) => {
  return (
    <Flex as='nav' className={S.segmentNavigationClassName} aria-label='상품 상태 필터'>
      {items.map((item) => {
        const isActive = item.value === activeSegment;

        return (
          <button
            key={item.value}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${item.label} ${item.count}`}
            className={cn(S.segmentItemClassName, isActive && S.segmentItemActiveClassName)}
            onClick={() => onSegmentChange?.(item.value)}
            type='button'
          >
            <span className={cn(S.segmentLabelClassName, isActive && S.segmentTextActiveClassName)}>
              {item.label}
            </span>
            <span className={cn(S.segmentCountClassName, isActive && S.segmentTextActiveClassName)}>
              {item.count}
            </span>
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
        className={cn(S.deleteButtonClassName, hasSelection && S.deleteButtonActiveClassName)}
        disabled={!hasSelection}
        onClick={onDeleteSelected}
        type='button'
      >
        선택삭제
      </button>
    </Flex>
  );
};

const SortButton = ({ onSortClick }: { onSortClick?: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button className={S.sortButtonClassName} onClick={onSortClick} type='button'>
      {sortIcon}
      <span className={S.sortButtonTextClassName}>정렬</span>
    </button>
  );
};

export const DesktopUploadHeader = ({
  activeSegment,
  className,
  completedCount,
  defaultSearchValue,
  needsEditCount,
  searchValue,
  selectedCount = 0,
  totalCount,
  onDeleteSelected,
  onSearch,
  onSearchValueChange,
  onSegmentChange,
  onSortClick,
}: DesktopUploadHeaderProps) => {
  const [uncontrolledActiveSegment, setUncontrolledActiveSegment] =
    useState<UploadSegmentTypes>('total');
  const isControlled = activeSegment !== undefined;
  const currentActiveSegment = isControlled ? activeSegment : uncontrolledActiveSegment;

  const segmentItems = [
    { count: totalCount, label: segmentLabels.total, value: 'total' },
    { count: completedCount, label: segmentLabels.completed, value: 'completed' },
    { count: needsEditCount, label: segmentLabels.needsEdit, value: 'needsEdit' },
  ] satisfies SegmentItem[];

  const handleSegmentChange = (segment: UploadSegmentTypes) => {
    if (!isControlled) {
      setUncontrolledActiveSegment(segment);
    }

    onSegmentChange?.(segment);
  };

  return (
    <Flex align='center' as='header' className={cn(S.headerClassName, className)} justify='between'>
      <SegmentNavigation
        activeSegment={currentActiveSegment}
        items={segmentItems}
        onSegmentChange={handleSegmentChange}
      />

      <Flex align='center' className={S.actionsClassName}>
        <SelectedProductAction selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} />
        <SortButton onSortClick={onSortClick} />
        <SearchBar
          defaultValue={defaultSearchValue}
          icon={searchIcon}
          onSearch={onSearch}
          onValueChange={onSearchValueChange}
          value={searchValue}
        />
      </Flex>
    </Flex>
  );
};
