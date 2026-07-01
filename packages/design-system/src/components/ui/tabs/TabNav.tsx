import {
  type ComponentPropsWithRef,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../../styles';
import * as S from './Tabs.css';

export type TabNavProps = ComponentPropsWithRef<'nav'>;

export type TabNavListProps = ComponentPropsWithRef<'div'>;

interface TabNavItemOwnProps<TElement extends ElementType> {
  as?: TElement;
  children?: ReactNode;
  className?: string;
  current?: ComponentPropsWithRef<'a'>['aria-current'];
  disabled?: boolean;
  selected?: boolean;
}

export type TabNavItemProps<TElement extends ElementType = 'a'> = TabNavItemOwnProps<TElement> &
  Omit<
    ComponentPropsWithRef<TElement>,
    keyof TabNavItemOwnProps<TElement> | 'aria-current' | 'aria-disabled'
  >;

const TabNavRoot = ({ className, ref, ...props }: TabNavProps) => {
  return <nav ref={ref} className={cn(S.tabsRootClassName, className)} {...props} />;
};

const TabNavList = ({ className, ref, ...props }: TabNavListProps) => {
  return <div ref={ref} className={cn(S.tabsListClassName, className)} {...props} />;
};

const TabNavItemRoot = <TElement extends ElementType = 'a'>(
  itemProps: TabNavItemProps<TElement>,
) => {
  const {
    as,
    children,
    className,
    current = 'page',
    disabled = false,
    onClick,
    ref,
    selected = false,
    tabIndex,
    ...props
  } = itemProps as TabNavItemProps<ElementType>;
  const Component = as ?? 'a';

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <Component
      {...props}
      ref={ref}
      aria-current={selected ? current : undefined}
      aria-disabled={disabled || undefined}
      className={cn(S.tabItemClassName, className)}
      data-selected={selected || undefined}
      onClick={handleClick}
      tabIndex={disabled ? -1 : tabIndex}
    >
      {children}
    </Component>
  );
};

export const TabNav = Object.assign(TabNavRoot, {
  Item: TabNavItemRoot,
  List: TabNavList,
  Root: TabNavRoot,
});
