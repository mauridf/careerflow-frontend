import api from '@/lib/axios';
import {
  ApiResponse,
  DashboardStatsResponse,
  ResumeInsightsResponse,
  ActivityResponse,
  ViewsChartResponse,
  SkillsGapResponse,
} from '@/types';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<ApiResponse<DashboardStatsResponse>>(
      '/dashboard/stats'
    );
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get<ApiResponse<ResumeInsightsResponse>>(
      '/dashboard/insights'
    );
    return response.data;
  },

  getActivity: async (limit: number = 10) => {
    const response = await api.get<ApiResponse<ActivityResponse[]>>(
      `/dashboard/activity?limit=${limit}`
    );
    return response.data;
  },

  getViewsChart: async (days: number = 30) => {
    const response = await api.get<ApiResponse<ViewsChartResponse>>(
      `/dashboard/views-chart?days=${days}`
    );
    return response.data;
  },

  getSkillsGap: async () => {
    const response = await api.get<ApiResponse<SkillsGapResponse>>(
      '/dashboard/skills-gap'
    );
    return response.data;
  },
};