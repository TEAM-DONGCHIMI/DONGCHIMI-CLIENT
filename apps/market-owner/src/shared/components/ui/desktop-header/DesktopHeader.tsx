import { type ReactNode } from 'react';

import { Flex } from '@dongchimi/design-system/components';
import { IcSearchSizeSmall } from '@dongchimi/design-system/icons';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './DesktopHeader.css';

interface DesktopHeaderSearchProps {
  searchValue?: string;
  onSearch?: SearchBarProps['onSearch'];
  onSearchValueChange?: SearchBarProps['onValueChange'];
}

interface DesktopHeaderBaseProps extends DesktopHeaderSearchProps {
  className?: string;
  searchSlot?: ReactNode;
  showSearchBar?: boolean;
}

interface DesktopHeaderDefaultProps {
  currentLabel: string;
  logo?: ReactNode;
  parentLabel: string;
  variant?: 'default';
}

interface DesktopHeaderOnlyHomeProps {
  homeLabel?: string;
  variant: 'onlyHome';
}

export type DesktopHeaderProps = DesktopHeaderBaseProps &
  (DesktopHeaderDefaultProps | DesktopHeaderOnlyHomeProps);

const searchIcon = <IcSearchSizeSmall aria-hidden='true' className={S.searchIconClassName} />;

const renderSearchBar = ({
  searchValue,
  onSearch,
  onSearchValueChange,
}: DesktopHeaderSearchProps) => (
  <SearchBar
    aria-label='상품 검색'
    icon={searchIcon}
    onSearch={onSearch}
    onValueChange={onSearchValueChange}
    placeholder='상품 검색...'
    value={searchValue}
  />
);

const renderSearchArea = ({
  searchSlot,
  searchValue,
  onSearch,
  onSearchValueChange,
}: DesktopHeaderSearchProps & { searchSlot?: ReactNode }) => {
  return searchSlot ?? renderSearchBar({ searchValue, onSearch, onSearchValueChange });
};

export const DesktopHeader = ({
  className,
  searchSlot,
  searchValue,
  showSearchBar = true,
  onSearch,
  onSearchValueChange,
  ...props
}: DesktopHeaderProps) => {
  const hasLogo = props.variant !== 'onlyHome' && props.logo != null;

  if (hasLogo) {
    return (
      <Flex align='center' as='header' className={cn(S.logoHeaderClassName, className)}>
        <span className={S.logoSlotClassName}>{props.logo}</span>

        <Flex align='center' as='nav' aria-label='현재 위치' className={S.logoBreadcrumbClassName}>
          <span className={S.parentLabelClassName}>{props.parentLabel}</span>
          <span aria-hidden='true' className={S.separatorClassName}>
            /
          </span>
          <span aria-current='page' className={S.currentLabelClassName}>
            {props.currentLabel}
          </span>
        </Flex>

        {showSearchBar && (
          <span className={S.logoSearchSlotClassName}>
            {renderSearchArea({ searchSlot, searchValue, onSearch, onSearchValueChange })}
          </span>
        )}
      </Flex>
    );
  }

  return (
    <Flex align='center' as='header' className={cn(S.headerClassName, className)} justify='between'>
      {props.variant === 'onlyHome' ? (
        <span className={S.homeLabelClassName}>{props.homeLabel ?? '동치미 작업 홈'}</span>
      ) : (
        <Flex align='center' as='nav' className={S.breadcrumbClassName} aria-label='현재 위치'>
          <span className={S.parentLabelClassName}>{props.parentLabel}</span>
          <span aria-hidden='true' className={S.separatorClassName}>
            /
          </span>
          <span aria-current='page' className={S.currentLabelClassName}>
            {props.currentLabel}
          </span>
        </Flex>
      )}

      {showSearchBar &&
        renderSearchArea({ searchSlot, searchValue, onSearch, onSearchValueChange })}
    </Flex>
  );
};
