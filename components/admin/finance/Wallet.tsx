'use client';

import React, { useState } from 'react';
import { BarChart3, Users, Bike, RefreshCw, Download } from 'lucide-react';
import PlatformOverview from '@/components/admin/wallet/PlatformOverview';
import PlatformTransactions from '@/components/admin/wallet/PlatformTransactions';
import MerchantWalletsTable from '@/components/admin/wallet/MerchantWalletsTable';
import RiderWalletsTable from '@/components/admin/wallet/RiderWalletsTable';
import WithdrawalModal from '@/components/admin/wallet/WithdrawalModal';
import { walletService } from '@/services/wallet.service';
import type { MerchantWallet, PlatformRevenue } from '@/services/wallet.service';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'merchants' | 'riders';

export default function AdminWalletPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [platformRevenue, setPlatformRevenue] = useState<PlatformRevenue | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const revenue = await walletService.getPlatformRevenue();
      setPlatformRevenue(revenue);
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleWithdrawalSuccess = async () => {
    await handleRefresh();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Wallet Management
            </h1>
            <p className="text-gray-600">
              Monitor platform revenue, merchant payouts, and rider earnings
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Platform Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'merchants'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Merchant Wallets
              </div>
            </button>
            <button
              onClick={() => setActiveTab('riders')}
              className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'riders'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Rider Wallets
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            <PlatformOverview />
            <PlatformTransactions />
          </>
        )}
        {activeTab === 'merchants' && (
          <MerchantWalletsTable onViewDetails={() => {
            toast('Merchant details modal coming soon');
          }} />
        )}
        {activeTab === 'riders' && (
          <RiderWalletsTable onViewDetails={() => {
            toast('Rider details modal coming soon');
          }} />
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && platformRevenue && (
        <WithdrawalModal
          currentBalance={platformRevenue.currentBalance}
          onClose={() => setShowWithdrawalModal(false)}
          onSuccess={handleWithdrawalSuccess}
        />
      )}
    </div>
  );
}