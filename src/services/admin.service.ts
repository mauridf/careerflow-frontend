import api from '@/lib/axios';
import {
  ApiResponse,
  AdminSystemStatsResponse,
  AdminUsersListResponse,
  AdminUserDetailResponse,
  UpdateUserRequest,
} from '@/types';

export const adminService = {
  getOverview: async () => {
    const response = await api.get<ApiResponse<AdminSystemStatsResponse>>(
      '/admin/stats/overview'
    );
    return response.data;
  },

  getUsers: async (params: { page?: number; pageSize?: number; search?: string }) => {
    const response = await api.get<ApiResponse<AdminUsersListResponse>>(
      '/admin/users',
      { params }
    );
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get<ApiResponse<AdminUserDetailResponse>>(
      `/admin/users/${id}`
    );
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    const response = await api.put<ApiResponse<AdminUserDetailResponse>>(
      `/admin/users/${id}`,
      data
    );
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await api.patch<ApiResponse<AdminUserDetailResponse>>(
      `/admin/users/${id}/status`
    );
    return response.data;
  },

  managePremium: async (id: string, activate: boolean, until?: string) => {
    const params = new URLSearchParams();
    params.append('activate', String(activate));
    if (until) params.append('until', until);
    const response = await api.patch<ApiResponse<AdminUserDetailResponse>>(
      `/admin/users/${id}/premium?${params.toString()}`
    );
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },
};