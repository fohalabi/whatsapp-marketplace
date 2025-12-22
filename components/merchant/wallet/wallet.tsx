'use client';

import React from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

type PayoutStatus = 'Pending' | 'Paid';

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: PayoutStatus;
}

const mockPayouts: Payout[] = [
  { id: 'PAY-2001', date: 'Dec 20, 2024', amount: 125640.00, status: 'Paid' },
  { id: 'PAY-2002', date: 'Dec 15, 2024', amount: 89000.50, status: 'Paid' },
  { id: 'PAY-2003', date: 'Dec 10, 2024', amount: 1423210.75, status: 'Paid' },
  { id: 'PAY-2004', date: 'Dec 5, 2024', amount: 76345.00, status: 'Paid' },
  { id: 'PAY-2005', date: 'Nov 30, 2024', amount: 210094.25, status: 'Paid' },
  { id: 'PAY-2006', date: 'Nov 25, 2024', amount: 98023.00, status: 'Paid' },
];

export default function MerchantWalletPage() {
  const availableBalance = 3232450.75;
  const pendingBalance = 1223180.50;
  const totalEarned = 2456790.90;

  const getStatusConfig = (status: PayoutStatus) => {
    if (status === 'Pending') {
      return {
        label: 'Pending',
        color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
        icon: Clock
      };
    }
    return {
      label: 'Paid',
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
      icon: CheckCircle
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your earnings and payout history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-100 text-sm font-medium">Available Balance</span>
            <Wallet size={20} className="text-emerald-100" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(availableBalance)}
          </div>
          <p className="text-emerald-100 text-xs">Ready for withdrawal</p>
        </div>

        {/* Pending Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending Balance</span>
            <Clock size={20} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(pendingBalance)}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Processing orders</p>
        </div>

        {/* Total Earned */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Earned</span>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(totalEarned)}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">All time earnings</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payout History
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Payout ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockPayouts.map((payout) => {
                const statusConfig = getStatusConfig(payout.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {payout.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {payout.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payout.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {mockPayouts.map((payout) => {
            const statusConfig = getStatusConfig(payout.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={payout.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                      {payout.id}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {payout.date}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(payout.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}