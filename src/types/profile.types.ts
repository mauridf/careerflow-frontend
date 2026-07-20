// ============================================
// Profile Types
// ============================================

export interface ProfileResponse {
  id: string;
  userId: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  birthDate: string | null;
  professionalSummary: string | null;
  photoUrl: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  isPublic: boolean;
  resumeSlug: string | null;
  completionPercentage: number;
  canGenerateResume: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  phone?: string;
  city?: string;
  state?: string;
  birthDate?: string;
  professionalSummary?: string;
  currentPosition?: string;
  currentCompany?: string;
}

export type UpdateProfileRequest = CreateProfileRequest;

export interface ProfileCompletionResponse {
  percentage: number;
  canGenerateResume: boolean;
  missingFields: string[];
  completedFields: string[];
}

export interface PhotoUploadResponse {
  photoUrl: string;
}