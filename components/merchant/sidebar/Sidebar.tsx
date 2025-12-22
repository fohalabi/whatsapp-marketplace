'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { MerchantSidebarItem } from './SidebarItem';
import { merchantMainItems, merchantBottomItems } from './SidebarData';

export const MerchantSidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Calculate active item directly from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const activeItem = pathSegments.slice(0, 2).join('/') || 'merchant/dashboard';

  const handleItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Merchant Portal
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed lg:fixed top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            Merchant
          </h1>
        </div>

        {/* Main Navigation - Flat */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {merchantMainItems.map((item) => (
            <MerchantSidebarItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleItemClick}
            />
          ))}
        </nav>

        {/* Bottom Section (Profile) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {merchantBottomItems.map((item) => (
            <MerchantSidebarItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};