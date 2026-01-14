import api from '@/lib/api';

export const riderApprovalService = {
  getPendingRiders: async () => {
    return api.get('/riders/approval/pending');
  },

  getAllRiders: async (status?: string) => {
    const url = status ? `/riders/approval?status=${status}` : '/riders/approval';
    return api.get(url);
  },

  approveRider: async (riderId: string) => {
    return api.patch(`/riders/approval/${riderId}/approve`);
  },

  rejectRider: async (riderId: string, reason: string) => {
    return api.patch(`/riders/approval/${riderId}/reject`, { reason });
  },
};