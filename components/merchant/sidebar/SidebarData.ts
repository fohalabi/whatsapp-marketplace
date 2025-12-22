import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Wallet,
  User,
} from 'lucide-react';

export const merchantMainItems = [
  { id: 'merchant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'merchant/products', label: 'Products', icon: Package },
  { id: 'merchant/stock', label: 'Stock', icon: Warehouse },
  { id: 'merchant/orders', label: 'Orders', icon: ShoppingCart },
  { id: 'merchant/wallet', label: 'Wallet', icon: Wallet },
];

export const merchantBottomItems = [
  { id: 'merchant/profile', label: 'Profile', icon: User },
];