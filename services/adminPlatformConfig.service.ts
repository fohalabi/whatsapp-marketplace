import api from '@/lib/api';

export interface ConfigData {
  businessHoursEnabled: boolean;
  openTime: string;
  closeTime: string;
  mainlandToIsland: number;
  islandToMainland: number;
  mainlandToMainland: number;
  islandToIsland: number;
  defaultDeliveryFee: number;
  orderCutoffEnabled: boolean;
  orderCutoffTime: string;
  autoConfirmOrders: boolean;
  allowWeekendDelivery: boolean;
}

export interface ApiResponse<T = ConfigData> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const adminPlatformConfigService = {
  /**
   * Fetch platform configuration
   */
  getPlatformConfig: async (): Promise<ApiResponse<ConfigData>> => {
    try {
      const response = await api.get('/platform/config');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch configuration');
    }
  },

  /**
   * Update platform configuration
   */
  updatePlatformConfig: async (config: ConfigData): Promise<ApiResponse<ConfigData>> => {
    try {
      const response = await api.put('/platform/config', config);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to save configuration');
    }
  },
};
