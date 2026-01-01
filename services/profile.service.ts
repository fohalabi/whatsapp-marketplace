import api from '@/lib/api';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdatePreferencesData {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

interface Toggle2FAData {
  enabled: boolean;
}

export const profileService = {
  // Admin profile
  getAdminProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  updateAdminPreferences: async (data: UpdatePreferencesData) => {
    const response = await api.patch('/admin/profile/preferences', data);
    return response.data;
  },

  changeAdminPassword: async (data: ChangePasswordData) => {
    const response = await api.patch('/admin/profile/password', data);
    return response.data;
  },

  toggleAdmin2FA: async (data: Toggle2FAData) => {
    const response = await api.patch('/admin/profile/2fa', data);
    return response.data;
  },

  // Merchant profile
  submitMerchantVerification: async (formData: FormData) => {
    const response = await api.post('/merchant/verification', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMerchantProfile: async () => {
    const response = await api.get('/merchant/profile');
    return response.data;
  },

  updateMerchantProfile: async (data: {
    businessName: string;
    category: string;
    location: string;
    phone: string;
  }) => {
    const response = await api.put('/merchant/profile', data);
    return response.data;
  },

  changeMerchantPassword: async (data: ChangePasswordData) => {
    const response = await api.patch('/merchant/password', data);
    return response.data;
  },

  // Product methods
  createProduct: async (formData: FormData) => {
    const response = await api.post('/merchant/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMerchantProducts: async () => {
    const response = await api.get('/merchant/products');
    return response.data;
  },

  // Team manaagement methods
  getAllTeamMembers: async () => {
    const response = await api.get('/admin/team');
    return response.data;
  },

  inviteTeamMember: async (data: { name: string; email: string; role: string }) => {
    const response = await api.post('/admin/team/invite', data);
    return response.data;
  },

  updateMemberRole: async (memberId: string, role: string) => {
    const response = await api.patch(`/admin/team/${memberId}/role`, { role });
    return response.data;
  },

  toggleMemberStatus: async (memberId: string) => {
    const response = await api.patch(`/admin/team/${memberId}/status`);
    return response.data;
  },

  getRolePermissions: async () => {
    const response = await api.get('/admin/team/roles');
    return response.data;
  },

  verifyInviteToken: async (token: string) => {
    const response = await api.get(`/admin/team/verify-invite/${token}`);
    return response.data;
  },

  acceptInvite: async (data: { token: string; password: string }) => {
    const response = await api.post('/admin/team/accept-invite', data);
    return response.data;
  },
};