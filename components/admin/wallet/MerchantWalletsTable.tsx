'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, RefreshCw } from 'lucide-react';
import { walletService } from '@/services/wallet.service';
import type { MerchantWallet } from '@/services/wallet.service';
import toast from 'react-hot-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

interface MerchantWalletsTableProps {
  onViewDetails?: (wallet: MerchantWallet) => void;
}

export default function MerchantWalletsTable({ onViewDetails }: MerchantWalletsTableProps) {
  const [wallets, setWallets] = useState<MerchantWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'balance' | 'createdAt' | 'transactionCount'>('balance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const data = await walletService.getAllMerchantWallets();
      setWallets(data || []);
    } catch (error) {
      console.error('Failed to fetch merchant wallets:', error);
      toast.error('Failed to load merchant wallets');
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWallets = wallets.filter((w) => {
    const matchesSearch = 
      w.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.merchantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'balance') {
      return sortOrder === 'desc' ? b.balance - a.balance : a.balance - b.balance;
    } else if (sortBy === 'transactionCount') {
      return sortOrder === 'desc' 
        ? b.transactionCount - a.transactionCount 
        : a.transactionCount - b.transactionCount;
    } else {
      return sortOrder === 'desc'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const paginatedWallets = filteredWallets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredWallets.length / itemsPerPage));

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    toast.success('Export functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by phone, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchWallets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Showing ${paginatedWallets.length} of ${filteredWallets.length} wallets`}
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-gray-200 rounded h-10 w-10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="bg-gray-200 rounded h-4 w-32"></div>
                      <div className="bg-gray-200 rounded h-3 w-24"></div>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded h-6 w-24"></div>
                </div>
              ))}
            </div>
          ) : paginatedWallets.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No merchant wallets found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('balance')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Balance
                      {sortBy === 'balance' && (
                        <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings / Withdrawals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('transactionCount')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Transactions
                      {sortBy === 'transactionCount' && (
                        <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedWallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{wallet.merchantName}</div>
                        <div className="text-sm text-gray-500">{wallet.phone}</div>
                        <div className="text-xs text-gray-400">{wallet.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(wallet.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-green-600 font-medium">
                          +{formatCurrency(wallet.totalEarnings)}
                        </div>
                        <div className="text-red-600">
                          -{formatCurrency(wallet.totalWithdrawals)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{wallet.transactionCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(wallet.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(wallet.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewDetails?.(wallet)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-3 py-1 rounded hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}