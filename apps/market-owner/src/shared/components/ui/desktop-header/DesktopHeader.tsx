import { Flex } from '@dongchimi/design-system/components';
import { cn } from '@dongchimi/design-system/styles';

import { SearchBar, type SearchBarProps } from '../search-bar';
import * as S from './DesktopHeader.css';

export type DesktopHeaderModeTypes = 'default' | 'onlyHome';

interface DesktopHeaderSearchProps {
  searchValue?: string;
  onSearch?: SearchBarProps['onSearch'];
  onSearchValueChange?: SearchBarProps['onValueChange'];
}

interface DesktopHeaderBaseProps extends DesktopHeaderSearchProps {
  className?: string;
}

interface DesktopHeaderDefaultProps {
  currentLabel: string;
  mode?: 'default';
  parentLabel: string;
}

interface DesktopHeaderOnlyHomeProps {
  homeLabel?: string;
  mode: 'onlyHome';
}

export type DesktopHeaderProps = DesktopHeaderBaseProps &
  (DesktopHeaderDefaultProps | DesktopHeaderOnlyHomeProps);

const searchIcon = <span aria-hidden='true' className={S.searchIconClassName} />;

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

export const DesktopHeader = (props: DesktopHeaderProps) => {
  const { className, searchValue, onSearch, onSearchValueChange } = props;

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

      {renderSearchBar({ searchValue, onSearch, onSearchValueChange })}
    </Flex>
  );
};
