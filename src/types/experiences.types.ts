// ============================================
// Experiences Types
// ============================================

export interface ExperienceResponse {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  skillsUsed: string[];
  city: string | null;
  state: string | null;
  country: string;
  employmentType: string | null;
  durationFormatted: string;
  displayOrder: number;
  createdAt: string;
}

export interface CreateExperienceRequest {
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
  skillsUsed?: string[];
  city?: string;
  state?: string;
  country?: string;
  employmentType?: number;
}

export type UpdateExperienceRequest = CreateExperienceRequest;