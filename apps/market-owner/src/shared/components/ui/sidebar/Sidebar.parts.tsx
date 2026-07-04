import { type ReactNode } from 'react';

import { cn } from '@dongchimi/design-system/styles';
import * as S from './Sidebar.css';
import { SidebarLink } from './SidebarLink';
import type { SidebarItem, SidebarNativeAsideProps, SidebarProfile } from './Sidebar.types';
import { SidebarContext, useSidebarItem } from './use-sidebar';

export interface SidebarRootProps extends SidebarNativeAsideProps {
  activeItemId?: string;
  onItemSelect?: (item: SidebarItem) => void;
  children: ReactNode;
}

export const SidebarRoot = ({
  activeItemId,
  children,
  className,
  onItemSelect,
  ref,
  ...props
}: SidebarRootProps) => (
  <SidebarContext.Provider value={{ activeItemId, onItemSelect }}>
    <aside ref={ref} className={cn(S.sidebar, className)} {...props}>
      {children}
    </aside>
  </SidebarContext.Provider>
);

SidebarRoot.displayName = 'Sidebar.Root';

export interface SidebarBrandProps {
  children: ReactNode;
}

export const SidebarBrand = ({ children }: SidebarBrandProps) => (
  <div className={S.sidebarBrand}>{children}</div>
);

SidebarBrand.displayName = 'Sidebar.Brand';

export const SidebarDivider = () => <div className={S.sidebarDivider} />;

SidebarDivider.displayName = 'Sidebar.Divider';

export interface SidebarProfileSlotProps {
  profile: SidebarProfile;
}

export const SidebarProfileSlot = ({ profile }: SidebarProfileSlotProps) => (
  <div className={S.sidebarProfile}>
    {profile.avatar && <div className={S.sidebarProfileAvatar}>{profile.avatar}</div>}
    <div className={S.sidebarProfileText}>
      <strong className={S.sidebarProfileTitle}>{profile.name}</strong>
      {profile.description && <span className={S.sidebarProfileEmail}>{profile.description}</span>}
    </div>
  </div>
);

SidebarProfileSlot.displayName = 'Sidebar.Profile';

export interface SidebarNavProps {
  'aria-label'?: string;
  children: ReactNode;
}

export const SidebarNav = ({ 'aria-label': ariaLabel, children }: SidebarNavProps) => (
  <nav aria-label={ariaLabel ?? '사이드바'} className={S.sidebarNav}>
    {children}
  </nav>
);

SidebarNav.displayName = 'Sidebar.Nav';

export interface SidebarSectionSlotProps {
  title?: ReactNode;
  items: SidebarItem[];
}

export const SidebarSectionSlot = ({ items, title }: SidebarSectionSlotProps) => (
  <div className={S.sidebarSection}>
    {title && <p className={S.sidebarSectionTitle}>{title}</p>}
    {items.map((item) => (
      <SidebarItemSlot key={item.id} item={item} />
    ))}
  </div>
);

SidebarSectionSlot.displayName = 'Sidebar.Section';

export interface SidebarItemSlotProps {
  item: SidebarItem;
}

export const SidebarItemSlot = ({ item }: SidebarItemSlotProps) => {
  const { handleClick, isActive } = useSidebarItem(item);
  return <SidebarLink active={isActive} item={item} onClick={handleClick} />;
};

SidebarItemSlot.displayName = 'Sidebar.Item';

export interface SidebarFooterProps {
  children: ReactNode;
}

export const SidebarFooter = ({ children }: SidebarFooterProps) => (
  <div className={S.sidebarFooter}>{children}</div>
);

SidebarFooter.displayName = 'Sidebar.Footer';

export interface SidebarHelpCardProps {
  children: ReactNode;
}

export const SidebarHelpCard = ({ children }: SidebarHelpCardProps) => (
  <div className={S.sidebarHelpCard}>{children}</div>
);

SidebarHelpCard.displayName = 'Sidebar.HelpCard';
