import { Flex } from '@dongchimi/design-system/components';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './HeaderDesktop.css';

export type HeaderDesktopModeTypes = 'default' | 'onlyHome';

interface HeaderDesktopSearchProps {
  defaultSearchValue?: string;
  searchValue?: string;
  onSearch?: SearchBarProps['onSearch'];
  onSearchValueChange?: SearchBarProps['onValueChange'];
}

interface HeaderDesktopBaseProps extends HeaderDesktopSearchProps {
  className?: string;
}

interface HeaderDesktopDefaultProps {
  currentLabel: string;
  mode?: 'default';
  parentLabel: string;
}

interface HeaderDesktopOnlyHomeProps {
  homeLabel?: string;
  mode: 'onlyHome';
}

export type HeaderDesktopProps = HeaderDesktopBaseProps &
  (HeaderDesktopDefaultProps | HeaderDesktopOnlyHomeProps);

const searchIcon = <span aria-hidden='true' className={S.searchIconClassName} />;

const renderSearchBar = ({
  defaultSearchValue,
  searchValue,
  onSearch,
  onSearchValueChange,
}: HeaderDesktopSearchProps) => (
  <SearchBar
    defaultValue={defaultSearchValue}
    icon={searchIcon}
    onSearch={onSearch}
    onValueChange={onSearchValueChange}
    value={searchValue}
  />
);

export const HeaderDesktop = (props: HeaderDesktopProps) => {
  const { className, defaultSearchValue, searchValue, onSearch, onSearchValueChange } = props;

  return (
    <Flex align='center' as='header' className={cn(S.headerClassName, className)} justify='between'>
      {props.mode === 'onlyHome' ? (
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

      {renderSearchBar({ defaultSearchValue, searchValue, onSearch, onSearchValueChange })}
    </Flex>
  );
};
