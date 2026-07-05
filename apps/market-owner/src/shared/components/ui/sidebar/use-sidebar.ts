import { createContext, useContext, type MouseEvent } from 'react';

import type { SidebarItem } from './Sidebar.types';

export interface SidebarContextValue {
  activeItemId?: string;
  onItemSelect?: (item: SidebarItem) => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('Sidebar 내부 컴포넌트는 Sidebar 컨텍스트 안에서만 사용할 수 있습니다.');
  }

  return context;
};

const isModifiedClick = (event: MouseEvent<HTMLElement>) => {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
};

export const useSidebarItem = (item: SidebarItem) => {
  const { activeItemId, onItemSelect } = useSidebarContext();
  const isActive = item.id === activeItemId;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (item.disabled || isModifiedClick(event)) {
      return;
    }

    onItemSelect?.(item);
  };

  return { isActive, handleClick };
};
