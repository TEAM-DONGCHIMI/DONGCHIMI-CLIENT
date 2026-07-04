import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { IcChevronRight } from '../../../icons';
import { cn } from '../../../styles';
import { NumButton } from '../num-button';
import * as S from './Navigation.css';

type NativeNavigationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children' | 'onChange'>;

export interface NavigationProps extends NativeNavigationProps {
  currentPage: number;
  getPageAriaLabel?: (page: number, selected: boolean) => string;
  nextDisabled?: boolean;
  nextIcon?: ReactNode;
  nextLabel?: string;
  onPageChange?: (page: number) => void;
  pages: readonly number[];
  previousDisabled?: boolean;
  previousIcon?: ReactNode;
  previousLabel?: string;
}

const DEFAULT_ARIA_LABEL = '페이지 탐색';
const DEFAULT_PREVIOUS_LABEL = '이전 페이지';
const DEFAULT_NEXT_LABEL = '다음 페이지';

const getDefaultPageAriaLabel = (page: number, selected: boolean) => {
  return selected ? `${page} 페이지, 현재 페이지` : `${page} 페이지`;
};

export const Navigation = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  currentPage,
  getPageAriaLabel = getDefaultPageAriaLabel,
  nextDisabled,
  nextIcon,
  nextLabel = DEFAULT_NEXT_LABEL,
  onPageChange,
  pages,
  previousDisabled,
  previousIcon,
  previousLabel = DEFAULT_PREVIOUS_LABEL,
  ...props
}: NavigationProps) => {
  const minPage = pages.length > 0 ? Math.min(...pages) : currentPage;
  const maxPage = pages.length > 0 ? Math.max(...pages) : currentPage;
  const isPreviousDisabled = previousDisabled ?? currentPage <= minPage;
  const isNextDisabled = nextDisabled ?? currentPage >= maxPage;
  const navigationLabel = ariaLabelledBy ? ariaLabel : (ariaLabel ?? DEFAULT_ARIA_LABEL);

  const handlePreviousClick = () => {
    if (!isPreviousDisabled) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled) {
      onPageChange?.(currentPage + 1);
    }
  };

  return (
    <nav
      aria-label={navigationLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(S.navigationClassName, className)}
      {...props}
    >
      <div className={S.containerClassName}>
        <button
          aria-label={previousLabel}
          className={S.iconButtonClassName}
          disabled={isPreviousDisabled}
          onClick={handlePreviousClick}
          type='button'
        >
          <span
            aria-hidden='true'
            className={cn(S.iconClassName, previousIcon == null && S.previousIconClassName)}
          >
            {previousIcon ?? <IcChevronRight />}
          </span>
        </button>

        <div className={S.pageListClassName}>
          {pages.map((page) => {
            const selected = page === currentPage;

            return (
              <NumButton
                aria-current={selected ? 'page' : undefined}
                aria-label={getPageAriaLabel(page, selected)}
                key={page}
                onClick={() => onPageChange?.(page)}
                selected={selected}
              >
                {page}
              </NumButton>
            );
          })}
        </div>

        <button
          aria-label={nextLabel}
          className={S.iconButtonClassName}
          disabled={isNextDisabled}
          onClick={handleNextClick}
          type='button'
        >
          <span aria-hidden='true' className={S.iconClassName}>
            {nextIcon ?? <IcChevronRight />}
          </span>
        </button>
      </div>
    </nav>
  );
};
