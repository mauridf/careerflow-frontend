import { api } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  Summary,
  SummaryRequest,
  SocialMedia,
  SocialMediaRequest,
  DashboardStats,
  ResumeResponse
} from '../types';

export const profileService = {
  // Summary endpoints
  getSummary: async (): Promise<Summary> => {
    const response = await api.get<Summary>(API_ENDPOINTS.PROFILE.SUMMARY);
    return response;
  },

  createSummary: async (data: SummaryRequest): Promise<Summary> => {
    const response = await api.post<Summary>(API_ENDPOINTS.PROFILE.SUMMARY, data);
    return response;
  },

  deleteSummary: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.PROFILE.SUMMARY);
  },

  // Social Medias endpoints
  getSocialMedias: async (): Promise<SocialMedia[]> => {
    const response = await api.get<SocialMedia[]>(API_ENDPOINTS.PROFILE.SOCIAL_MEDIAS);
    return response;
  },

  createSocialMedia: async (data: SocialMediaRequest): Promise<SocialMedia> => {
    const response = await api.post<SocialMedia>(API_ENDPOINTS.PROFILE.SOCIAL_MEDIAS, data);
    return response;
  },

  deleteSocialMedia: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.PROFILE.SOCIAL_MEDIAS}/${id}`);
  },

  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>(API_ENDPOINTS.PROFILE.DASHBOARD_STATS);
    return response;
  },

  // Resume data
  getResume: async (): Promise<ResumeResponse> => {
    const response = await api.get<ResumeResponse>(API_ENDPOINTS.PROFILE.RESUME);
    return response;
  },
};