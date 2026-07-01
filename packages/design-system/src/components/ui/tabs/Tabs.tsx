'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';

import { cn } from '../../../styles';
import * as S from './Tabs.css';

export type TabsActivationModeTypes = 'automatic' | 'manual';

type TabsValueProps =
  | {
      defaultValue: string;
      value?: never;
    }
  | {
      defaultValue?: never;
      value: string;
    };

export type TabsProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> &
  TabsValueProps & {
    activationMode?: TabsActivationModeTypes;
    idPrefix?: string;
    onValueChange?: (value: string) => void;
  };

export type TabsListProps = Omit<ComponentPropsWithRef<'div'>, 'role'>;

export interface TabsTriggerProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'aria-controls' | 'aria-selected' | 'id' | 'role' | 'tabIndex' | 'type' | 'value'
> {
  value: string;
}

export interface TabsPanelProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'aria-labelledby' | 'hidden' | 'id' | 'role' | 'tabIndex'
> {
  forceMount?: boolean;
  value: string;
}

interface TabsContextValues {
  activationMode: TabsActivationModeTypes;
  getPanelId: (value: string) => string;
  getTriggerId: (value: string) => string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValues | null>(null);

const useTabsContext = (componentName: string) => {
  const context = useContext(TabsContext);

  if (context == null) {
    throw new Error(`${componentName} must be used within Tabs.Root.`);
  }

  return context;
};

const createSafeIdPart = (value: string) => {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
};

const findEnabledTabs = (element: HTMLElement) => {
  return Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
};

const getTargetTabByKey = (
  key: string,
  tabs: HTMLButtonElement[],
  currentIndex: number,
): HTMLButtonElement | null => {
  if (tabs.length === 0) {
    return null;
  }

  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return tabs[(currentIndex + 1) % tabs.length];
    case 'ArrowLeft':
    case 'ArrowUp':
      return tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    case 'Home':
      return tabs[0];
    case 'End':
      return tabs[tabs.length - 1];
    default:
      return null;
  }
};

const isSelectionKey = (key: string) => {
  return key === 'Enter' || key === ' ';
};

const selectTabValue = (element: HTMLButtonElement, setSelectedValue: (value: string) => void) => {
  const nextValue = element.dataset.value;

  if (nextValue != null) {
    setSelectedValue(nextValue);
  }
};

const TabsRoot = ({
  activationMode = 'automatic',
  children,
  className,
  defaultValue,
  id,
  idPrefix,
  onValueChange,
  ref,
  value,
  ...props
}: TabsProps) => {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? value);
  const selectedValue = value ?? internalValue;
  const baseId = idPrefix ?? id ?? `tabs-${generatedId}`;

  const setSelectedValue = useCallback(
    (nextValue: string) => {
      if (value == null) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  const contextValue = useMemo<TabsContextValues>(
    () => ({
      activationMode,
      getPanelId: (tabValue) => `${baseId}-panel-${createSafeIdPart(tabValue)}`,
      getTriggerId: (tabValue) => `${baseId}-trigger-${createSafeIdPart(tabValue)}`,
      selectedValue,
      setSelectedValue,
    }),
    [activationMode, baseId, selectedValue, setSelectedValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} className={cn(S.tabsRootClassName, className)} id={id} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, onKeyDown, ref, tabIndex = -1, ...props }: TabsListProps) => {
  const { activationMode, setSelectedValue } = useTabsContext('Tabs.List');

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const tabs = findEnabledTabs(event.currentTarget);
    const currentIndex = tabs.indexOf(event.target as HTMLButtonElement);
    const targetTab = getTargetTabByKey(event.key, tabs, currentIndex);

    if (currentIndex < 0 || targetTab == null) {
      if (activationMode === 'manual' && isSelectionKey(event.key)) {
        event.preventDefault();
        selectTabValue(event.target as HTMLButtonElement, setSelectedValue);
      }

      return;
    }

    event.preventDefault();
    targetTab.focus();

    if (activationMode === 'automatic') {
      selectTabValue(targetTab, setSelectedValue);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(S.tabsListClassName, className)}
      onKeyDown={handleKeyDown}
      role='tablist'
      tabIndex={tabIndex}
      {...props}
    />
  );
};

const TabsTrigger = ({ className, disabled, onClick, ref, value, ...props }: TabsTriggerProps) => {
  const { getPanelId, getTriggerId, selectedValue, setSelectedValue } =
    useTabsContext('Tabs.Trigger');
  const isSelected = selectedValue === value;

  return (
    <button
      {...props}
      ref={ref}
      aria-controls={getPanelId(value)}
      aria-selected={isSelected}
      className={cn(S.tabItemClassName, className)}
      data-value={value}
      disabled={disabled}
      id={getTriggerId(value)}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !disabled) {
          setSelectedValue(value);
        }
      }}
      role='tab'
      tabIndex={isSelected ? 0 : -1}
      type='button'
    />
  );
};

const TabsPanel = ({ className, forceMount = false, ref, value, ...props }: TabsPanelProps) => {
  const { getPanelId, getTriggerId, selectedValue } = useTabsContext('Tabs.Panel');
  const isSelected = selectedValue === value;

  if (!forceMount && !isSelected) {
    return null;
  }

  return (
    <div
      {...props}
      ref={ref}
      aria-labelledby={getTriggerId(value)}
      className={cn(S.tabsPanelClassName, className)}
      hidden={!isSelected}
      id={getPanelId(value)}
      role='tabpanel'
      tabIndex={0}
    />
  );
};

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsRoot,
  Trigger: TabsTrigger,
});
