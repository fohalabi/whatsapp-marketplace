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

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export interface EscrowOrder {
  orderId: string;
  customer: string;
  merchant: string;
  orderAmount: string;
  heldAmount: string;
  deliveryStatus: string;
  escrowStatus: string;
  createdDate: string;
  daysInEscrow: number;
}

export interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export interface Merchant {
  id: string;
  merchant: string;
  availableBalance: string;
  pendingBalance: string;
  lastPayoutDate: string;
  payoutStatus: string;
  canPayout: boolean;
}

export interface Broadcast {
  id: string;
  name: string;
  targetSegment: string;
  messageType: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  sentDate: string;
  recipientCount: number;
  deliveryRate?: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'Promotions' | 'Alerts' | 'Updates' | 'Welcome';
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  lastUpdated: string;
  content: string;
  variables: string[];
}

export interface AdCampaign {
  id: string;
  campaignName: string;
  source: 'Facebook' | 'Instagram' | 'Google';
  clicks: number;
  chatsStarted: number;
  ordersGenerated: number;
  conversionRate: number;
  spend: number;
  revenue: number;
  roi: number;
  startDate: string;
}