import { type ReactNode } from 'react';

import {
  SidebarBrand,
  SidebarDivider,
  SidebarFooter,
  SidebarHelpCard,
  SidebarItemSlot,
  SidebarNav,
  SidebarProfileSlot,
  SidebarRoot,
  SidebarSectionSlot,
} from './Sidebar.parts';
import type {
  SidebarItem as SidebarItemData,
  SidebarNativeAsideProps,
  SidebarProfile as SidebarProfileData,
  SidebarSection as SidebarSectionData,
} from './Sidebar.types';

export type { SidebarItem, SidebarProfile, SidebarSection } from './Sidebar.types';

export interface SidebarProps extends SidebarNativeAsideProps {
  brand?: ReactNode;
  profile?: SidebarProfileData;
  sections: SidebarSectionData[];
  activeItemId?: string;
  footerItems?: SidebarItemData[];
  helpCard?: ReactNode;
  onItemSelect?: (item: SidebarItemData) => void;
}

const SidebarBase = ({
  activeItemId,
  brand,
  footerItems,
  helpCard,
  onItemSelect,
  profile,
  ref,
  sections,
  ...props
}: SidebarProps) => (
  <SidebarRoot ref={ref} activeItemId={activeItemId} onItemSelect={onItemSelect} {...props}>
    {brand && <SidebarBrand>{brand}</SidebarBrand>}
    {profile && (
      <>
        <SidebarDivider />
        <SidebarProfileSlot profile={profile} />
      </>
    )}
    <SidebarNav aria-label={props['aria-label']}>
      {sections.map((section, sectionIndex) => (
        <SidebarSectionSlot
          key={section.id ?? sectionIndex}
          items={section.items}
          title={section.title}
        />
      ))}
    </SidebarNav>
    {(footerItems?.length || helpCard) && (
      <SidebarFooter>
        {footerItems?.map((item) => (
          <SidebarItemSlot key={item.id} item={item} />
        ))}
        {helpCard && <SidebarHelpCard>{helpCard}</SidebarHelpCard>}
      </SidebarFooter>
    )}
  </SidebarRoot>
);

SidebarBase.displayName = 'Sidebar';

export const Sidebar = SidebarBase;
