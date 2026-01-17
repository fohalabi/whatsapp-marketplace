import api from '@/lib/api';

export const riderWalletService = {
  getWalletBalance: async () => {
    return api.get('/rider/wallet/balance');
  },

  getTransactions: async () => {
    return api.get('/rider/wallet/transactions');
  },

  getWithdrawalHistory: async (limit = 50) => {
    return api.get(`/rider/wallet/withdrawals?limit=${limit}`);
  },

  requestWithdrawal: async (amount: number, bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => {
    return api.post('/rider/wallet/withdraw', { amount, bankDetails });
  },

  getAllRiderWallets: async () => {
    return api.get('/rider/wallet/all');
  }
};