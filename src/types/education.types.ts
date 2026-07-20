// ============================================
// Education Types
// ============================================

export interface EducationResponse {
  id: string;
  institution: string;
  course: string;
  educationLevel: string;
  status: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  grade: string | null;
  thesisTitle: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface CreateEducationRequest {
  institution: string;
  course: string;
  educationLevel: number;
  startDate: string;
  endDate?: string | null;
  status?: number;
  description?: string;
  grade?: string;
  thesisTitle?: string;
}

export type UpdateEducationRequest = CreateEducationRequest;