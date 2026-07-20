import api from '@/lib/axios';
import {
  ApiResponse,
  ExperienceResponse,
  CreateExperienceRequest,
} from '@/types';

export const experiencesService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<ExperienceResponse[]>>(
      '/profile/experiences'
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<ExperienceResponse>>(
      `/profile/experiences/${id}`
    );
    return response.data;
  },

  create: async (data: CreateExperienceRequest) => {
    const response = await api.post<ApiResponse<ExperienceResponse>>(
      '/profile/experiences',
      data
    );
    return response.data;
  },

  update: async (id: string, data: CreateExperienceRequest) => {
    const response = await api.put<ApiResponse<ExperienceResponse>>(
      `/profile/experiences/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/profile/experiences/${id}`);
  },
};