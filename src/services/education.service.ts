import api from '@/lib/axios';
import {
  ApiResponse,
  EducationResponse,
  CreateEducationRequest,
} from '@/types';

export const educationService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<EducationResponse[]>>(
      '/profile/education'
    );
    return response.data;
  },

  create: async (data: CreateEducationRequest) => {
    const response = await api.post<ApiResponse<EducationResponse>>(
      '/profile/education',
      data
    );
    return response.data;
  },

  update: async (id: string, data: CreateEducationRequest) => {
    const response = await api.put<ApiResponse<EducationResponse>>(
      `/profile/education/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/profile/education/${id}`);
  },
};