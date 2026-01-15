'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  loading?: boolean;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600'
};

export default function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className = '',
  color = 'blue',
  loading = false
}: SummaryCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-200 rounded-lg w-12 h-12"></div>
          <div className="bg-gray-200 rounded w-16 h-4"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-3 w-24"></div>
          <div className="bg-gray-200 rounded h-6 w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}