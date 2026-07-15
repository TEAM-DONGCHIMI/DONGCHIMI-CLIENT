import { type ComponentPropsWithoutRef } from 'react';

import { Navigation } from '@dongchimi/design-system';
import { cn } from '@dongchimi/design-system/styles';

import * as S from './PaginationFooter.css';

type NativeFooterProps = Omit<ComponentPropsWithoutRef<'footer'>, 'children' | 'onChange'>;

export interface PaginationFooterProps extends NativeFooterProps {
  currentPage: number;
  getPageAriaLabel?: (page: number, selected: boolean) => string;
  nextDisabled?: boolean;
  nextLabel?: string;
  onPageChange?: (page: number) => void;
  pages: readonly number[];
  previousDisabled?: boolean;
  previousLabel?: string;
  rangeEnd: number;
  rangeStart: number;
  showNavigation?: boolean;
  totalCount: number;
}

const DEFAULT_PREVIOUS_LABEL = '이전 페이지';
const DEFAULT_NEXT_LABEL = '다음 페이지';

const getDefaultPageAriaLabel = (page: number, selected: boolean) => {
  return selected ? `${page} 페이지, 현재 페이지` : `${page} 페이지`;
};

export const PaginationFooter = ({
  'aria-label': ariaLabel = '페이지네이션 정보',
  className,
  currentPage,
  getPageAriaLabel = getDefaultPageAriaLabel,
  nextDisabled,
  nextLabel = DEFAULT_NEXT_LABEL,
  onPageChange,
  pages,
  previousDisabled,
  previousLabel = DEFAULT_PREVIOUS_LABEL,
  rangeEnd,
  rangeStart,
  showNavigation = true,
  totalCount,
  ...props
}: PaginationFooterProps) => {
  const currentRange = `${rangeStart}~${rangeEnd}`;

  return (
    <footer aria-label={ariaLabel} className={cn(S.rootClassName, className)} {...props}>
      <div className={S.contentClassName}>
        <div className={S.summaryClassName}>
          <span>전체</span>
          <strong className={S.summaryValueClassName}>{totalCount}</strong>
          <span>개 중</span>
          <strong className={S.summaryValueClassName}>{currentRange}</strong>
          <span>표시 중</span>
        </div>
      </div>

      {showNavigation && (
        <Navigation
          className={S.navigationClassName}
          currentPage={currentPage}
          getPageAriaLabel={getPageAriaLabel}
          nextDisabled={nextDisabled}
          nextLabel={nextLabel}
          onPageChange={onPageChange}
          pages={pages}
          previousDisabled={previousDisabled}
          previousLabel={previousLabel}
        />
      )}
    </footer>
  );
};
