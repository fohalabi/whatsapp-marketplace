import api from '../lib/api';

export const fulfillmentService = {
    async getAllFulfillments() {
    const response = await api.get('/fulfillment');
    return response.data;
  },

  async getFulfillmentStats() {
    const response = await api.get('/fulfillment/stats');
    return response.data;
  },

  async getDeliveryById(deliveryId: string) {
    const response = await api.get(`/fulfillment/${deliveryId}`);
    return response.data;
  },

  async assignRider(deliveryId: string, riderId: string) {
    const response = await api.post(`/fulfillment/${deliveryId}/assign-rider`, { riderId });
    return response.data;
  },

  async notifyMerchant(deliveryId: string) {
    const response = await api.post(`/fulfillment/${deliveryId}/notify-merchant`);
    return response.data;
  },
}