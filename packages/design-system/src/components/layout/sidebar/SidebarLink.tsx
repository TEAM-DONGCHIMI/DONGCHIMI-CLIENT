import { type MouseEvent, type ReactNode } from 'react';

import * as S from './Sidebar.css';
import type { SidebarItem } from './Sidebar.types';

export interface SidebarLinkProps {
  item: SidebarItem;
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const SidebarLinkContent = ({ icon, label }: Pick<SidebarItem, 'icon' | 'label'>) => (
  <>
    {icon && (
      <span aria-hidden='true' className={S.sidebarItemIcon}>
        {icon}
      </span>
    )}
    <span className={S.sidebarItemLabel}>{label}</span>
  </>
);

export const SidebarLink = ({ active = false, item, onClick }: SidebarLinkProps) => {
  const className = S.sidebarItem({ active, disabled: item.disabled ?? false });
  const content: ReactNode = <SidebarLinkContent icon={item.icon} label={item.label} />;

  if (item.href && !item.disabled) {
    return (
      <a
        aria-current={active ? 'page' : undefined}
        className={className}
        href={item.href}
        onClick={(event) => onClick?.(event)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      aria-current={active ? 'page' : undefined}
      className={className}
      disabled={item.disabled}
      onClick={(event) => onClick?.(event)}
      type='button'
    >
      {content}
    </button>
  );
};

SidebarLink.displayName = 'Sidebar.Link';
