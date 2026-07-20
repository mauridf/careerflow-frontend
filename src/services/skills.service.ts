import api from '@/lib/axios';
import {
  ApiResponse,
  SkillResponse,
  CreateSkillRequest,
  SkillCategoryResponse,
  ReorderSkillsRequest,
  MessageResponse,
} from '@/types';

export const skillsService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<SkillResponse[]>>('/profile/skills');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<ApiResponse<SkillCategoryResponse[]>>(
      '/profile/skills/categories'
    );
    return response.data;
  },

  create: async (data: CreateSkillRequest) => {
    const response = await api.post<ApiResponse<SkillResponse>>('/profile/skills', data);
    return response.data;
  },

  update: async (id: string, data: CreateSkillRequest) => {
    const response = await api.put<ApiResponse<SkillResponse>>(
      `/profile/skills/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/profile/skills/${id}`);
  },

  reorder: async (data: ReorderSkillsRequest) => {
    const response = await api.post<ApiResponse<MessageResponse>>(
      '/profile/skills/reorder',
      data
    );
    return response.data;
  },
};