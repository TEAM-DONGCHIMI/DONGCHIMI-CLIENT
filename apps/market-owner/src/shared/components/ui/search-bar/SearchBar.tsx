import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from 'react';

import { cn } from '@dongchimi/design-system/styles';

import * as S from './SearchBar.css';

type NativeSearchFormProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  'aria-label' | 'children' | 'onSubmit' | 'role'
>;

const SEARCH_MAX_LENGTH = 17;
const SEARCH_INPUT_NAME = 'search';

export type SearchBarSizeTypes = 'small' | 'medium';

type SearchBarValueChangeHandlerTypes = (
  value: string,
  event: ChangeEvent<HTMLInputElement>,
) => void;

type SearchBarSubmitHandlerTypes = (value: string, event: FormEvent<HTMLFormElement>) => void;

export interface SearchBarProps extends NativeSearchFormProps {
  'aria-label': string;
  icon?: ReactNode;
  placeholder: string;
  size?: SearchBarSizeTypes;
  value?: string;
  isError?: boolean;
  onValueChange?: SearchBarValueChangeHandlerTypes;
  onSearch?: SearchBarSubmitHandlerTypes;
}

export const SearchBar = ({
  'aria-label': ariaLabel,
  className,
  icon,
  placeholder,
  size = 'small',
  value,
  isError = false,
  onValueChange,
  onSearch,
  ...formProps
}: SearchBarProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(event.currentTarget.value, event);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchInput = event.currentTarget.elements.namedItem(SEARCH_INPUT_NAME);
    const searchValue = searchInput instanceof HTMLInputElement ? searchInput.value : '';

    onSearch?.(searchValue, event);
  };

  return (
    <form
      {...formProps}
      aria-label={ariaLabel}
      className={cn(S.searchBarClassName, S.searchBarSizeClassNames[size], className)}
      data-error={isError || undefined}
      onSubmit={handleSubmit}
      role='search'
    >
      {icon && (
        <span aria-hidden='true' className={S.iconClassName}>
          {icon}
        </span>
      )}
      <input
        aria-invalid={isError || undefined}
        aria-label={ariaLabel}
        className={S.inputClassName}
        maxLength={SEARCH_MAX_LENGTH}
        name={SEARCH_INPUT_NAME}
        onChange={handleChange}
        placeholder={placeholder}
        type='search'
        value={value}
      />
    </form>
  );
};
