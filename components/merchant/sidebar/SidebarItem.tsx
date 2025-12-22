'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface MerchantSidebarItemProps {
  item: {
    id: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
  };
  isActive: boolean;
  onClick: () => void;
}

export const MerchantSidebarItem: React.FC<MerchantSidebarItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const href = `/${item.id}`;
  const Icon = item.icon;

  return (
    <Link href={href} onClick={onClick}>
      <button
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-900 dark:text-emerald-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
        aria-label={item.label}
      >
        <Icon size={18} className="flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full dark:bg-red-900 dark:text-red-300">
            {item.badge}
          </span>
        )}
      </button>
    </Link>
  );
};