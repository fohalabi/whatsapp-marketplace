'use client';

import { useState, useEffect } from 'react';
import { riderWalletService } from '@/services/riderWallet.service';
import { Wallet, TrendingUp, ArrowDownCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  totalFee: number;
  riderAmount: number;
  platformAmount: number;
  status: string;
  completedAt: string;
  delivery: {
    deliveryNumber: string;
    createdAt: string;
  };
}

export default function RiderWalletPage() {
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
  });

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        riderWalletService.getWalletBalance(),
        riderWalletService.getTransactions(),
      ]);

      setBalance(balanceRes.data.data.balance);
      setPendingBalance(balanceRes.data.data.pendingBalance);
      setTotalEarnings(balanceRes.data.data.totalEarnings);
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      toast.error('Enter valid amount');
      return;
    }

    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
      toast.error('Complete all bank details');
      return;
    }

    try {
      await riderWalletService.requestWithdrawal(amount, bankDetails);
      toast.success('Withdrawal request submitted!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setBankDetails({ accountName: '', accountNumber: '', bankName: '' });
      fetchWalletData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Available Balance</p>
              <p className="text-4xl font-bold">₦{balance.toLocaleString()}</p>
              <span className="ml-2 text-xs">(Withdrawable)</span>
            </div>
            <Wallet className="w-12 h-12 text-blue-200" />
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-blue-100 text-sm">Total Earnings</p>
              <p className="text-xl font-semibold">₦{totalEarnings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Completed Deliveries</p>
              <p className="text-xl font-semibold">{transactions.length}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Pending Balance</p>
              <p className="text-xl font-semibold">₦{pendingBalance.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium mt-4 hover:bg-blue-50 transition-colors"
          >
            <ArrowDownCircle className="w-5 h-5 inline mr-2" />
            Withdraw Funds
          </button>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Delivery #{transaction.delivery.deliveryNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +₦{transaction.riderAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Fee: ₦{transaction.totalFee.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Withdraw Funds</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: ₦{balance.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  placeholder="0123456789"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="Access Bank"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}