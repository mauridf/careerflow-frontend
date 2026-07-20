import api from '@/lib/axios';
import {
  ApiResponse,
  ProfileResponse,
  CreateProfileRequest,
  ProfileCompletionResponse,
  PhotoUploadResponse,
  MessageResponse,
} from '@/types';

export const profileService = {
  get: async () => {
    const response = await api.get<ApiResponse<ProfileResponse>>('/profile');
    return response.data;
  },

  create: async (data: CreateProfileRequest) => {
    const response = await api.post<ApiResponse<ProfileResponse>>('/profile', data);
    return response.data;
  },

  update: async (data: CreateProfileRequest) => {
    const response = await api.put<ApiResponse<ProfileResponse>>('/profile', data);
    return response.data;
  },

  getCompletion: async () => {
    const response = await api.get<ApiResponse<ProfileCompletionResponse>>(
      '/profile/completion'
    );
    return response.data;
  },

  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post<ApiResponse<PhotoUploadResponse>>(
      '/profile/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deletePhoto: async () => {
    const response = await api.delete<ApiResponse<MessageResponse>>('/profile/photo');
    return response.data;
  },
};