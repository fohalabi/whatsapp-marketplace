'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, ArrowUpRight } from 'lucide-react';
import SummaryCard from './SummaryCard';
import { walletService } from '@/services/wallet.service';
import type { PlatformRevenue } from '@/services/wallet.service';
import toast from 'react-hot-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function PlatformOverview() {
  const [loading, setLoading] = useState(true);
  const [platformData, setPlatformData] = useState<PlatformRevenue | null>(null);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      const revenue = await walletService.getPlatformRevenue();
      setPlatformData(revenue);
    } catch (error) {
      console.error('Failed to fetch platform revenue:', error);
      toast.error('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Platform Revenue"
          value={platformData ? formatCurrency(platformData.totalRevenue) : '₦0'}
          icon={Wallet}
          color="blue"
          loading={loading}
        />
        <SummaryCard
          title="Total Payouts"
          value={platformData ? formatCurrency(platformData.totalPayouts) : '₦0'}
          icon={ArrowUpRight}
          color="orange"
          loading={loading}
        />
        <SummaryCard
          title="Current Balance"
          value={platformData ? formatCurrency(platformData.currentBalance) : '₦0'}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
      </div>

      {/* Additional Platform Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Platform Summary</h3>
          <button
            onClick={fetchPlatformData}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : platformData ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(platformData.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payouts</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(platformData.totalPayouts)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(platformData.currentBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(platformData.totalRevenue - platformData.totalPayouts)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
}