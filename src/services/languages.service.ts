import api from '@/lib/axios';
import {
  ApiResponse,
  LanguageResponse,
  CreateLanguageRequest,
} from '@/types';

export const languagesService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<LanguageResponse[]>>(
      '/profile/languages'
    );
    return response.data;
  },

  create: async (data: CreateLanguageRequest) => {
    const response = await api.post<ApiResponse<LanguageResponse>>(
      '/profile/languages',
      data
    );
    return response.data;
  },

  update: async (id: string, data: CreateLanguageRequest) => {
    const response = await api.put<ApiResponse<LanguageResponse>>(
      `/profile/languages/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/profile/languages/${id}`);
  },
};