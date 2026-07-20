// ============================================
// Skills Types
// ============================================

export interface SkillResponse {
  id: string;
  name: string;
  category: string;
  proficiencyLevel: string;
  proficiencyScore: number;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CreateSkillRequest {
  name: string;
  category: number;
  proficiencyLevel: number;
  isPrimary?: boolean;
  displayOrder?: number;
}

export type UpdateSkillRequest = CreateSkillRequest;

export interface SkillCategoryResponse {
  value: number;
  displayName: string;
  icon: string;
}

export interface ReorderSkillsRequest {
  skills: {
    id: string;
    displayOrder: number;
  }[];
}