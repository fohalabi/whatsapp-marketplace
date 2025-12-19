import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  badge?: number;
}

export interface SidebarSection {
  section: string;
  icon: LucideIcon;
  items: SidebarItem[];
}