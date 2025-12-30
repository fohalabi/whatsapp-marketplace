import api from '../lib/api';

export const adminProductService = {
  async getAllProducts(status?: string, limit: number = 10, skip: number = 0) {
    const params: any = { limit, skip };
    if (status && status !== 'all') {
      params.status = status;
    }
    
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  async approveProduct(productId: string) {
    const response = await api.patch(`/admin/products/${productId}/approve`);
    return response.data;
  },

  async hideProduct(productId: string) {
    const response = await api.patch(`/admin/products/${productId}/hide`);
    return response.data;
  },

  async rejectProduct(productId: string, reason: string) {
    const response = await api.patch(`/admin/products/${productId}/reject`, { reason });
    return response.data;
  },

  async updateProductPricing(productId: string, markup: number) {
    const response = await api.patch(`/admin/products/${productId}/pricing`, { markup });
    return response.data;
  },

  async bulkUpdatePricing(productIds: string[], markup: number) {
    const response = await api.patch('/admin/products/bulk-pricing', { productIds, markup });
    return response.data;
  },

  async toggleProductStatus(productId: string, isActive: boolean) {
    const response = await api.patch(`/admin/products/${productId}/toggle-status`, { isActive });
    return response.data;
  },
};