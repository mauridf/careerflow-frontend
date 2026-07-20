import api from '@/lib/axios';
import {
  ApiResponse,
  SocialNetworkResponse,
  CreateSocialNetworkRequest,
} from '@/types';

export const socialNetworksService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<SocialNetworkResponse[]>>(
      '/profile/social-networks'
    );
    return response.data;
  },

  create: async (data: CreateSocialNetworkRequest) => {
    const response = await api.post<ApiResponse<SocialNetworkResponse>>(
      '/profile/social-networks',
      data
    );
    return response.data;
  },

  update: async (id: string, data: CreateSocialNetworkRequest) => {
    const response = await api.put<ApiResponse<SocialNetworkResponse>>(
      `/profile/social-networks/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/profile/social-networks/${id}`);
  },
};