// ============================================
// Dashboard Types
// ============================================

export interface DashboardStatsResponse {
  totalViews: number;
  uniqueViews: number;
  pdfDownloads: number;
  sharesCount: number;
  atsScore: number | null;
  completionPercentage: number;
  lastViewedAt: string | null;
  isPublished: boolean;
  skillsCount: number;
  experiencesCount: number;
  educationCount: number;
  certificatesCount: number;
  languagesCount: number;
}

export interface ResumeInsightsResponse {
  professionalSummary: string | null;
  completionPercentage: number;
  canGenerateResume: boolean;
  atsScore: number | null;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface ActivityResponse {
  action: string;
  entityType: string;
  createdAt: string;
  description: string;
}

export interface ViewsChartResponse {
  dataPoints: ViewsDataPoint[];
}

export interface ViewsDataPoint {
  period: string;
  views: number;
  downloads: number;
}

export interface SkillsGapResponse {
  presentSkills: string[];
  recommendedSkills: string[];
  primaryCategory: string | null;
}