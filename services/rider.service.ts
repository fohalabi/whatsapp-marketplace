import api from '@/lib/api';

export const riderService = {
  async getProfile() {
    const response = await api.get('/riders/profile');
    return response.data;
  },

  async updateStatus(status: 'OFFLINE' | 'AVAILABLE' | 'BUSY') {
    const response = await api.patch('/riders/status', { status });
    return response.data;
  },

  async updateLocation(latitude: number, longitude: number) {
    const response = await api.patch('/riders/location', { latitude, longitude });
    return response.data;
  },

  async getMyDeliveries() {
    const response = await api.get('/riders/deliveries');
    return response.data;
  },

  async updateDeliveryStatus(
    deliveryId: string,
    status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED',
    proofImage?: string,
    notes?: string
  ) {
    const response = await api.patch(`/riders/deliveries/${deliveryId}/status`, {
      status,
      proofImage,
      notes,
    });
    return response.data;
  },
};