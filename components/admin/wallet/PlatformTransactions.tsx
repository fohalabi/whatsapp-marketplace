'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { walletService } from '@/services/wallet.service';
import type { Transaction } from '@/services/wallet.service';
import toast from 'react-hot-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function PlatformTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchTransactions();
  }, [limit]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await walletService.getPlatformTransactions(limit);
      setTransactions(data || []);
    } catch (error) {
      console.error('Failed to fetch platform transactions:', error);
      toast.error('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Export functionality coming soon');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platform Transactions</h2>
            <p className="text-sm text-gray-600 mt-1">
              All revenue and withdrawal transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>Last 10</option>
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
            </select>
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between py-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-gray-200 rounded-lg w-10 h-10"></div>
                  <div className="space-y-2 flex-1">
                    <div className="bg-gray-200 rounded h-4 w-32"></div>
                    <div className="bg-gray-200 rounded h-3 w-48"></div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded h-6 w-24"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance After
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(txn.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        txn.type === 'REVENUE' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {txn.type === 'REVENUE' ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{txn.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {txn.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    txn.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {txn.amount >= 0 ? '+' : ''}{formatCurrency(txn.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(txn.balanceAfter)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      {txn.reference}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      txn.metadata?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      txn.metadata?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      txn.metadata?.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {String(txn.metadata?.status || 'COMPLETED')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {transactions.length} transactions</span>
            <span>Total: {formatCurrency(
              transactions.reduce((sum, txn) => sum + txn.amount, 0)
            )}</span>
          </div>
        </div>
      )}
    </div>
  );
}