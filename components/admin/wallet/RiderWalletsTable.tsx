'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, RefreshCw, Bike } from 'lucide-react';
import toast from 'react-hot-toast';
import { riderWalletService } from '@/services/riderWallet.service';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

interface RiderWallet {
  id: string;
  riderId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  walletBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalDeliveries: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RiderWalletsTableProps {
  onViewDetails?: (wallet: RiderWallet) => void;
}

export default function RiderWalletsTable({ onViewDetails }: RiderWalletsTableProps) {
  const [wallets, setWallets] = useState<RiderWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'walletBalance' | 'totalEarnings' | 'totalDeliveries'>('walletBalance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRiderWallets();
  }, []);

    const fetchRiderWallets = async () => {
        setLoading(true);
        try {
            const response = await riderWalletService.getAllRiderWallets();
            const data = response.data;
            
            if (data.success) {
            setWallets(data.data || []);
            } else {
            throw new Error(data.message);
            }
        } catch (error: any) {
            console.error('Failed to fetch rider wallets:', error);
            toast.error('Failed to load rider wallets');
            setWallets([]);
        } finally {
            setLoading(false);
        }
    };

  const filteredWallets = wallets.filter((w) => {
    const fullName = `${w.firstName} ${w.lastName}`.toLowerCase();
    const matchesSearch = 
      w.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      w.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'walletBalance') {
      return sortOrder === 'desc' ? b.walletBalance - a.walletBalance : a.walletBalance - b.walletBalance;
    } else if (sortBy === 'totalEarnings') {
      return sortOrder === 'desc' ? b.totalEarnings - a.totalEarnings : a.totalEarnings - b.totalEarnings;
    } else {
      return sortOrder === 'desc' 
        ? b.totalDeliveries - a.totalDeliveries 
        : a.totalDeliveries - b.totalDeliveries;
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
    // Create CSV content
    const headers = ['Rider Name', 'Phone', 'Email', 'Available Balance', 'Pending Balance', 'Total Earnings', 'Deliveries', 'Status', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...filteredWallets.map(w => [
        `"${w.firstName} ${w.lastName}"`,
        w.phone,
        w.email,
        w.walletBalance,
        w.pendingBalance,
        w.totalEarnings,
        w.totalDeliveries,
        w.status,
        new Date(w.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rider-wallets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Rider wallets exported successfully');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800' },
      BUSY: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      OFFLINE: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.OFFLINE;

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
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
              onClick={fetchRiderWallets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={filteredWallets.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Showing ${paginatedWallets.length} of ${filteredWallets.length} riders`}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Total Available:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(filteredWallets.reduce((sum, w) => sum + w.walletBalance, 0))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Total Pending:</span>
              <span className="font-semibold text-yellow-600">
                {formatCurrency(filteredWallets.reduce((sum, w) => sum + w.pendingBalance, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Riders Table */}
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
            <div className="p-12 text-center">
              <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No rider wallets found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery ? 'Try adjusting your search criteria' : 'Riders will appear here once they join'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('walletBalance')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Available Balance
                      {sortBy === 'walletBalance' && (
                        <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('totalEarnings')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Total Earnings
                      {sortBy === 'totalEarnings' && (
                        <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('totalDeliveries')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Deliveries
                      {sortBy === 'totalDeliveries' && (
                        <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                  <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {wallet.firstName} {wallet.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{wallet.phone}</div>
                        <div className="text-xs text-gray-400">{wallet.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(wallet.walletBalance)}
                      </div>
                      <div className="text-xs text-gray-500">Withdrawable</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-yellow-600">
                        {formatCurrency(wallet.pendingBalance)}
                      </div>
                      <div className="text-xs text-gray-500">Awaiting confirmation</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(wallet.totalEarnings)}
                      </div>
                      <div className="text-xs text-gray-500">Lifetime</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{wallet.totalDeliveries}</div>
                      <div className="text-xs text-gray-500">completed</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(wallet.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(wallet.updatedAt).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined: {new Date(wallet.createdAt).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onViewDetails?.(wallet)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
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
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && filteredWallets.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Riders</p>
              <p className="text-2xl font-bold text-gray-900">{filteredWallets.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Available Balance</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredWallets.reduce((sum, w) => sum + w.walletBalance, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pending Balance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(filteredWallets.reduce((sum, w) => sum + w.pendingBalance, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(filteredWallets.reduce((sum, w) => sum + w.totalEarnings, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}