import api from '@/lib/api';

export interface WalletData {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  reference: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
}

export interface AdjustmentRequest {
  amount: number;
  reason?: string;
  note?: string;
}

export interface PlatformRevenue {
  totalRevenue: number;
  totalPayouts: number;
  currentBalance: number;
}

export interface MerchantWallet {
  id: string;
  merchantId: string;
  merchantName: string;
  phone: string;
  email: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  transactionCount: number;
  createdAt: string;
  updatedAt: string;
}

class WalletService {
  // Merchant endpoints
  async getMerchantDashboard(merchantId: string): Promise<WalletData> {
    const response = await api.get(`/wallet/merchant/${merchantId}/dashboard`);
    return response.data.data;
  }

  async getMerchantTransactions(merchantId: string, limit = 50): Promise<Transaction[]> {
    const response = await api.get(`/wallet/merchant/${merchantId}/transactions?limit=${limit}`);
    return response.data.data;
  }

  async requestWithdrawal(merchantId: string, data: WithdrawalRequest) {
    const response = await api.post(`/wallet/merchant/${merchantId}/withdraw`, data);
    return response.data;
  }

  // Platform endpoints
  async getPlatformRevenue(): Promise<PlatformRevenue> {
    const response = await api.get('/wallet/platform/revenue');
    return response.data.data;
  }

  async withdrawFromPlatform(data: WithdrawalRequest) {
    const response = await api.post('/wallet/platform/withdraw', data);
    return response.data;
  }

  // Platform transactions
  async getPlatformTransactions(limit = 50): Promise<Transaction[]> {
    const response = await api.get(`/wallet/platform/transactions?limit=${limit}`);
    return response.data.data;
  }

  async getAllMerchantWallets(): Promise<MerchantWallet[]> {
    const response = await api.get('/wallet/merchants/all');
    return response.data.data;
  }

  async getPlatformWallet(): Promise<{ totalRevenue: number; totalPayouts: number; currentBalance: number; deliveryFeeEarnings: number }> {
    const response = await api.get('/wallet/platform');
    return response.data.data;
  }
}

export const walletService = new WalletService();