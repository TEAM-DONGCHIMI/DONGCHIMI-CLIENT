import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SidebarNativeAsideProps = Omit<ComponentPropsWithRef<'aside'>, 'children'>;

export interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
}

export interface SidebarSection {
  id?: string;
  title?: ReactNode;
  items: SidebarItem[];
}

export interface SidebarProfile {
  name: ReactNode;
  description?: ReactNode;
  avatar?: ReactNode;
}
