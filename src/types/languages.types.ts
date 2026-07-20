// ============================================
// Languages Types
// ============================================

export interface LanguageResponse {
  id: string;
  languageName: string;
  proficiencyLevel: string;
  proficiencyScore: number;
  isNative: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CreateLanguageRequest {
  languageName: string;
  proficiencyLevel: number;
  isNative?: boolean;
}

export type UpdateLanguageRequest = CreateLanguageRequest;