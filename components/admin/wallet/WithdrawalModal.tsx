'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { walletService } from '@/services/wallet.service';
import toast from 'react-hot-toast';

interface WithdrawalModalProps {
  currentBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function WithdrawalModal({ currentBalance, onClose, onSuccess }: WithdrawalModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amount > currentBalance) {
      newErrors.amount = 'Insufficient balance';
    }

    if (!bankAccountName.trim()) {
      newErrors.bankAccountName = 'Account name is required';
    }

    if (!bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = 'Account number is required';
    } else if (bankAccountNumber.length !== 10) {
      newErrors.bankAccountNumber = 'Account number must be 10 digits';
    }

    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await walletService.withdrawFromPlatform({
        amount,
        bankAccountName,
        bankAccountNumber,
        bankName
      });

      toast.success('Withdrawal request submitted successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      toast.error(error.message || 'Failed to process withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Platform Withdrawal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Balance */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(currentBalance)}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount
            </label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Bank Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              placeholder="Enter account name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bankAccountName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bankAccountName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bankAccountName}
              </p>
            )}
          </div>

          {/* Bank Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit account number"
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bankAccountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bankAccountNumber && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bankAccountNumber}
              </p>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select bank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="GTBank">GTBank</option>
              <option value="First Bank">First Bank</option>
              <option value="UBA">UBA</option>
              <option value="Zenith Bank">Zenith Bank</option>
              <option value="Fidelity Bank">Fidelity Bank</option>
              <option value="Union Bank">Union Bank</option>
              <option value="Stanbic IBTC">Stanbic IBTC</option>
              <option value="Sterling Bank">Sterling Bank</option>
              <option value="Wema Bank">Wema Bank</option>
              <option value="Polaris Bank">Polaris Bank</option>
              <option value="Ecobank">Ecobank</option>
              <option value="FCMB">FCMB</option>
            </select>
            {errors.bankName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bankName}
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>Please verify all bank details carefully. Withdrawals cannot be reversed once processed.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}