import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../../styles';
import {
  sidebar,
  sidebarBrand,
  sidebarDivider,
  sidebarFooter,
  sidebarHelpCard,
  sidebarNav,
  sidebarProfile,
  sidebarProfileAvatar,
  sidebarProfileEmail,
  sidebarProfileText,
  sidebarProfileTitle,
  sidebarSection,
  sidebarSectionTitle,
} from './Sidebar.css';
import { SidebarLink } from './SidebarLink';
import type { SidebarItem, SidebarNativeAsideProps, SidebarProfile } from './Sidebar.types';
import { SidebarContext, useSidebarItem } from './use-sidebar';

export interface SidebarRootProps extends SidebarNativeAsideProps {
  activeItemId?: string;
  onItemSelect?: (item: SidebarItem) => void;
  children: ReactNode;
}

export const SidebarRoot = forwardRef<HTMLElement, SidebarRootProps>(
  ({ activeItemId, children, className, onItemSelect, ...props }, ref) => (
    <SidebarContext.Provider value={{ activeItemId, onItemSelect }}>
      <aside ref={ref} className={cn(sidebar, className)} {...props}>
        {children}
      </aside>
    </SidebarContext.Provider>
  ),
);

SidebarRoot.displayName = 'Sidebar.Root';

export interface SidebarBrandProps {
  children: ReactNode;
}

export const SidebarBrand = ({ children }: SidebarBrandProps) => (
  <div className={sidebarBrand}>{children}</div>
);

SidebarBrand.displayName = 'Sidebar.Brand';

export const SidebarDivider = () => <div className={sidebarDivider} />;

SidebarDivider.displayName = 'Sidebar.Divider';

export interface SidebarProfileSlotProps {
  profile: SidebarProfile;
}

export const SidebarProfileSlot = ({ profile }: SidebarProfileSlotProps) => (
  <div className={sidebarProfile}>
    {profile.avatar && <div className={sidebarProfileAvatar}>{profile.avatar}</div>}
    <div className={sidebarProfileText}>
      <strong className={sidebarProfileTitle}>{profile.name}</strong>
      {profile.description && <span className={sidebarProfileEmail}>{profile.description}</span>}
    </div>
  </div>
);

SidebarProfileSlot.displayName = 'Sidebar.Profile';

export interface SidebarNavProps {
  'aria-label'?: string;
  children: ReactNode;
}

export const SidebarNav = ({ 'aria-label': ariaLabel, children }: SidebarNavProps) => (
  <nav aria-label={ariaLabel ?? 'Sidebar'} className={sidebarNav}>
    {children}
  </nav>
);

SidebarNav.displayName = 'Sidebar.Nav';

export interface SidebarSectionSlotProps {
  title?: ReactNode;
  items: SidebarItem[];
}

export const SidebarSectionSlot = ({ items, title }: SidebarSectionSlotProps) => (
  <div className={sidebarSection}>
    {title && <p className={sidebarSectionTitle}>{title}</p>}
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
  <div className={sidebarFooter}>{children}</div>
);

SidebarFooter.displayName = 'Sidebar.Footer';

export interface SidebarHelpCardProps {
  children: ReactNode;
}

export const SidebarHelpCard = ({ children }: SidebarHelpCardProps) => (
  <div className={sidebarHelpCard}>{children}</div>
);

SidebarHelpCard.displayName = 'Sidebar.HelpCard';
