import api from '@/lib/axios';
import {
  ApiResponse,
  ResumeResponse,
  ResumeAnalyticsResponse,
  ShareResumeResponse,
  MessageResponse,
} from '@/types';

export const resumeService = {
  get: async () => {
    const response = await api.get<ApiResponse<ResumeResponse>>('/resume');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get<ApiResponse<ResumeAnalyticsResponse>>(
      '/resume/analytics'
    );
    return response.data;
  },

  share: async () => {
    const response = await api.post<ApiResponse<ShareResumeResponse>>('/resume/share');
    return response.data;
  },

  publish: async () => {
    const response = await api.put<ApiResponse<MessageResponse>>('/resume/publish');
    return response.data;
  },

  unpublish: async () => {
    const response = await api.put<ApiResponse<MessageResponse>>('/resume/unpublish');
    return response.data;
  },

  generatePdf: async () => {
    const response = await api.post('/resume/generate', null, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateAtsPdf: async () => {
    const response = await api.post('/resume/generate-ats', null, {
      responseType: 'blob',
    });
    return response.data;
  },

  getSharedResume: async (slug: string) => {
    const response = await api.get<ApiResponse<ResumeResponse>>(
      `/resume/shared/${slug}`
    );
    return response.data;
  },
};