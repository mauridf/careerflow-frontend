'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';
import { QUERY_KEYS } from '@/lib/constants';

export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: () => dashboardService.getStats(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardInsights() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_INSIGHTS],
    queryFn: () => dashboardService.getInsights(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardActivity(limit: number = 10) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_ACTIVITY, limit],
    queryFn: () => dashboardService.getActivity(limit),
  });
}

export function useDashboardViewsChart(days: number = 30) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_VIEWS_CHART, days],
    queryFn: () => dashboardService.getViewsChart(days),
  });
}

export function useDashboardSkillsGap() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_SKILLS_GAP],
    queryFn: () => dashboardService.getSkillsGap(),
    staleTime: 10 * 60 * 1000,
  });
}