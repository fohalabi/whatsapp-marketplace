import api from '@/lib/api';

export const riderWalletService = {
  getWalletBalance: async () => {
    return api.get('/rider/wallet/balance');
  },

  getTransactions: async () => {
    return api.get('/rider/wallet/transactions');
  },

  requestWithdrawal: async (amount: number, bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => {
    return api.post('/rider/wallet/withdraw', { amount, bankDetails });
  },
};